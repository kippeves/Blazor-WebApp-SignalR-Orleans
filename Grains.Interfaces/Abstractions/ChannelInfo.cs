namespace Grains.Interfaces.Abstractions
{
    [GenerateSerializer, Alias(nameof(ChannelInfo))]
    public sealed record class ChannelInfo
    {
        [Id(0)] public string Name = default!;
        [Id(1)] public string? Category;
        [Id(2)] public List<Message> _messages = new(100);
    }
}
