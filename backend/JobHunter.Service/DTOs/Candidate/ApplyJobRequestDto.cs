using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Candidate;

public class ApplyJobRequestDto
{
    [JsonPropertyName("resumeId")]
    public Guid ResumeId { get; set; }

    [JsonPropertyName("jobId")]
    public Guid JobId { get; set; }

    [JsonPropertyName("coverLetter")]
    public string? CoverLetter { get; set; }
}
