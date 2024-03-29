namespace Grains.Interfaces.Abstractions;

[GenerateSerializer]
[Alias("ChatMsg")]
public record class ChatMsg(string Name, string Message)
{
    [Id(0)]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Id(1)]
    public string Name { get; init; } = Name;

    [Id(2)]
    public string Message { get; set; } = Message;
    [Id(3)]
    public DateTime Created { get; init; } = DateTime.Now;
}