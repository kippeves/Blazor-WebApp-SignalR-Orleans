using Orleans;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Grains.Interfaces.Abstractions
{
    [GenerateSerializer, Alias(nameof(ChannelDetails))]
    public sealed record class ChannelDetails
    {
        [Id(0)] public List<ChatMsg> _messages = new(100);
        [Id(1)] public List<Guid> _onlineMembers = new(10);
    }
}
