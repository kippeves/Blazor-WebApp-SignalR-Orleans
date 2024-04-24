using Orleans.Serialization;

namespace Grains.Interfaces.Abstractions
{
    [GenerateSerializer, Alias("Message")]
    public class Message
    {
        [Id(0)]
        public Guid id { get; set; } = Guid.NewGuid();
        [Id(1)]
        public MemberInfo member { get; set; }
        public string value { get => values.First().text; set => values.Insert(0, new(value, DateTime.Now)); }
        [Id(2)]
        public List<MessageValue> values { get; set; } = [];
        [Id(3)]
        public DateTime created { get; init; } = DateTime.Now;
        [Id(4)]
        public DateTime? updated { get; set; }

        public Message(MemberInfo Member, string Text)
        {
            member = Member;
            value = Text;
        }
    }

    [GenerateSerializer, Alias("MessageValue")]
    public record MessageValue(string text, DateTime added);
}