using System.Text.Json.Serialization;

namespace JobHunter.Domain;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserRole
{
    Admin,
    HR,
    Candidate
}
