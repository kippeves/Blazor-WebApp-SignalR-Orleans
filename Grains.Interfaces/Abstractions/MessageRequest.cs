using Grains.Interfaces.Abstractions;

[GenerateSerializer]
public record MessageRequest(Guid channel, ChatMsg msg);