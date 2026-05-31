using System.Text.Json.Serialization;

namespace JobHunter.Domain;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum JobWorkType
{
    Onsite,
    Remote,
    Hybrid,
    Oversea
}
