namespace Grains.Interfaces.Abstractions;

[GenerateSerializer, Alias(nameof(MemberDetails))]
public sealed record class MemberDetails
{
    [Id(0)] public Guid id { get; set; } = default;
    [Id(2)] public string chatName { get; set; } = string.Empty;
    [Id(3)] public string pictureURL { get; set; } = string.Empty;
}