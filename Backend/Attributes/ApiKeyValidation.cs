public class ApiKeyValidation : IApiKeyValidation
{
    private readonly IConfiguration _configuration;
    public ApiKeyValidation(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public bool IsValidApiKey(string userApiKey)
    {
        if (string.IsNullOrWhiteSpace(userApiKey))
            return false;
        string? apiKey = _configuration.GetValue<string>(Constants.ApiKeyName);
        if (apiKey == null || apiKey != userApiKey)
            return false;
        return true;
    }
}

public static class Constants
{
    public const string ApiKeyHeaderName = "X-API-Key";
    public const string ApiKeyName = "ApiKey";
}