using System.Runtime.InteropServices.Marshalling;

namespace Grains.Interfaces.Abstractions
{
    [GenerateSerializer, Alias(nameof(AppSettings))]
    public sealed record class AppSettings
    {
        [Id(0)] public bool menuIsOpen { get; set; }
        [Id(1)] public Guid? activeChannel { get; set; }
        [Id(2)] public HashSet<Guid> SubscribedChannels { get; set; } = [];
    }
}