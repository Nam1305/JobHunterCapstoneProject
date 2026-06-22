using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.HR;

public class ApplicationDetailDto
{
    [JsonPropertyName("applicationId")]
    public Guid ApplicationId { get; set; }

    [JsonPropertyName("candidateName")]
    public string? CandidateName { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("matchScore")]
    public decimal? MatchScore { get; set; }

    [JsonPropertyName("aiSuggestion")]
    public string? AiSuggestion { get; set; }

    [JsonPropertyName("coverLetter")]
    public string? CoverLetter { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("fileUrl")]
    public string? FileUrl { get; set; }

    [JsonIgnore]
    public Guid JobId { get; set; }
}
