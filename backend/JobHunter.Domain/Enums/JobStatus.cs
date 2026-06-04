using System.Text.Json.Serialization;

namespace JobHunter.Domain;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum JobStatus
{
    Open,
    Closed
}
