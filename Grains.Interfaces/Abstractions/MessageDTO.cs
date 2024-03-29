using Orleans;

[GenerateSerializer]
public record MessageResponseDTO(string channel, MessageValueDTO message);
[GenerateSerializer]
public record MessageValueDTO(Guid id, ChatUserDTO user, string message, DateTime created);
[GenerateSerializer]
public record ChatUserDTO(Guid id, string name);