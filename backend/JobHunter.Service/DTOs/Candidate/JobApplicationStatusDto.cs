using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Candidate;

public class JobApplicationStatusDto
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("cvAppliedUrl")]
    public string CVAppliedURL { get; set; } = string.Empty;

    [JsonPropertyName("appliedAt")]
    public DateTimeOffset? AppliedAt { get; set; }
}
