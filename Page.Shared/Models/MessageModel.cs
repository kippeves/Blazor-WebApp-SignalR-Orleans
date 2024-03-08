namespace Page.Shared.Models
{
    public class MessageModel
    {
        public MessageModel() { }

        public MessageModel(string? user, string? message, DateTime? sent)
        {
            User = user;
            Message = message;
            Sent = sent;
        }

        public string? User { get; set; }
        public string? Message { get; set; }
        public DateTime? Sent { get; set; }
    };
}
