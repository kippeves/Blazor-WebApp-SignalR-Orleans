namespace Grains.Interfaces.Abstractions
{
    [GenerateSerializer, Alias(nameof(ChannelDetails))]
    public sealed record class ChannelDetails
    {
        [Id(0)] public string Name = default!;
        [Id(1)] public string? Category;
        [Id(2)] public List<ChatMsg> _messages = new(100);
    }
}
