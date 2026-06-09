using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.HR;

public class CandidateDto
{
    [JsonPropertyName("applicationId")]
    public Guid ApplicationId { get; set; }

    [JsonPropertyName("candidateId")]
    public Guid CandidateId { get; set; }

    [JsonPropertyName("candidateName")]
    public string? CandidateName { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("resumeUrl")]
    public string? ResumeUrl { get; set; }

    [JsonPropertyName("appliedAt")]
    public DateTimeOffset? AppliedAt { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("matchScore")]
    public decimal? MatchScore { get; set; }
}
