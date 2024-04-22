namespace Grains.Interfaces.Abstractions;

[GenerateSerializer]
[Alias("ChatMsg")]
public record class ChatMsg(MemberDetails User, string Message)
{
    [Id(0)]
    public Guid Id { get; set; } = Guid.NewGuid();
    [Id(1)]
    public MemberDetails User { get; init; } = User;

    [Id(2)]
    public string Message { get; set; } = Message;
    [Id(3)]
    public DateTime Created { get; init; } = DateTime.Now;
}