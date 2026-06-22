using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Candidate;

public class JobApplicationStatusDto
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("cvAppliedUrl")]
    public string CVAppliedURL { get; set; } = string.Empty;

    [JsonPropertyName("fileName")]
    public string? FileName { get; set; }

    [JsonPropertyName("appliedAt")]
    public DateTimeOffset? AppliedAt { get; set; }
}
