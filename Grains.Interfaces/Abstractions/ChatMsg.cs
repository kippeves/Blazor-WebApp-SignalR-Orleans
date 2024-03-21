using Orleans;

namespace Grains.Interfaces.Abstractions;

[GenerateSerializer]
public record class ChatMsg(
    string User,
    string Message)
{
    [Id(0)]
    public Guid id { get; set; } = Guid.NewGuid();
    [Id(1)]
    public string User { get; init; } = User;

    [Id(2)]
    public string Message { get; set; } = Message;
    [Id(3)]
    public DateTime Created { get; init; } = DateTime.Now;
}