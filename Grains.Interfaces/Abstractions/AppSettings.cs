namespace Grains.Interfaces.Abstractions
{
    [GenerateSerializer, Alias(nameof(AppSettings))]
    public sealed record class AppSettings
    {
        [Id(0)] public bool MenuIsOpen { get; set; }
        [Id(1)] public Guid? ActiveChannel { get; set; }

    }
}