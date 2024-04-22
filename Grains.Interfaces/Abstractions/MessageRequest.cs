using Grains.Interfaces.Abstractions;

[GenerateSerializer]
public record MessageResponse(Guid channelId, ChatMsg msg);