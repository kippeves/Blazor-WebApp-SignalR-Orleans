using Orleans.Configuration;
using Orleans.Providers;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source = AppDb.db"));



builder.WebHost.UseKestrel((context, serverOptions) =>
{
    var port = 7084;
    var pfxFilePath = builder.Environment.ContentRootPath + "/certificate.pfx";
    var pfxPassword = "Password1!";

    serverOptions.Listen(IPAddress.Any, port, listenOptions =>
    {
        listenOptions.Protocols = HttpProtocols.Http1AndHttp2AndHttp3;
        listenOptions.UseHttps(pfxFilePath, pfxPassword);
    });
});

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(o =>
    {
        o.Audience = builder.Configuration["Jwt:Audience"];
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
            ValidateLifetime = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true

        };
        o.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = async context =>
            {
                Console.WriteLine("Exception: {0}", System.Text.Json.JsonSerializer.Serialize(context.Exception.Message));
                Console.WriteLine("Fail: + {0}", System.Text.Json.JsonSerializer.Serialize(context.Request.Headers));
                await Task.CompletedTask;
            },
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                // If the request is for our hub...
                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/hubs/chathub"))
                {
                    // Read the token out of the query string
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddScoped<IApiKeyValidation, ApiKeyValidation>();
builder.Services.AddScoped<ApiKeyAuthFilter>();
builder.Services.AddAuthorization();


builder.Host.UseOrleans(static siloBuilder =>
{
    var createShard = false;

    siloBuilder.UseLocalhostClustering();
    //    siloBuilder.AddMemoryGrainStorageAsDefault().AddMemoryGrainStorage("PubSub");
    siloBuilder.UseMongoDBClient("mongodb+srv://****/?appName=mongosh+2.2.3");
    siloBuilder.UseMongoDBClustering(options =>
    {
        options.DatabaseName = "OrleansTestApp";
        options.CreateShardKeyForCosmos = createShard;
    }).AddMongoDBGrainStorageAsDefault(options =>
    {
        options.DatabaseName = "SignalRChat";
        options.CreateShardKeyForCosmos = createShard;
    }).AddMongoDBGrainStorage(ProviderConstants.DEFAULT_PUBSUB_PROVIDER_NAME,
    options =>
    {
        options.DatabaseName = "SignalRPubSub";
        options.CreateShardKeyForCosmos = createShard;
    }
    ).Configure<ClusterOptions>(options =>
    {
        options.ClusterId = "chatcluster";
        options.ServiceId = "chatcluster";
    });

    /*    siloBuilder.AddCosmosGrainStorageAsDefault(
        configureOptions: static options =>
        {
            options.IsResourceCreationEnabled = true;
            options.ContainerThroughputProperties = ThroughputProperties.CreateAutoscaleThroughput(1000);
            options.ConfigureCosmosClient(cosmosConnection);
        });
        siloBuilder.AddCosmosGrainStorage(
            name: "PubSub",
            configureOptions: static options =>
            {
                options.IsResourceCreationEnabled = true;
                options.ContainerThroughputProperties = ThroughputProperties.CreateAutoscaleThroughput(1000);
                options.ConfigureCosmosClient(cosmosConnection);
            });*/
    siloBuilder.UseSignalR(); // Adds ability #1 and #2 to Orleans.
    siloBuilder.RegisterHub<ChatHub>(); // Required for each hub type if the backplane ability #1 is being used.
});

builder.Services.AddSignalR().AddOrleans(); // Tells the SignalR hubs in the web application to use Orleans as a backplane (ability #1)
builder.Services.AddScoped<IChannelRepository, ChannelRepository>();
builder.Services.AddScoped<DataInitializer>();

builder.Services.AddResponseCompression(opts =>
{
    opts.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(["application/octet-stream"]);
});

builder.Services.AddControllers();


var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    await scope.ServiceProvider.GetService<DataInitializer>()!.SeedRoles();
}
app.UseCors(builder =>
        builder
        .WithOrigins("https://192.168.2.124:3000")
        .AllowCredentials()
        .AllowAnyMethod()
        .AllowAnyHeader());
app.UseResponseCompression();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapHub<ChatHub>("/hubs/chathub");
app.MapControllers();

app.Run();
