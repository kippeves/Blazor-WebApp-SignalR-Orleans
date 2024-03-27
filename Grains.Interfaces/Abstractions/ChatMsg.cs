namespace Grains.Interfaces.Abstractions;

[GenerateSerializer]
public record class ChatMsg(
    Guid UserId,
    string Message)
{
    [Id(0)]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Id(1)]
    public Guid UserId { get; init; } = UserId;

    [Id(2)]
    public string Message { get; set; } = Message;
    [Id(3)]
    public DateTime Created { get; init; } = DateTime.Now;
}