namespace Grains.Interfaces.Abstractions;

[GenerateSerializer, Alias(nameof(MemberInfo))]
public sealed record class MemberInfo
{
    [Id(0)] public Guid Id { get; set; } = default;
    [Id(2)] public string ChatName { get; set; } = string.Empty;
    [Id(3)] public string PictureURL { get; set; } = string.Empty;
}