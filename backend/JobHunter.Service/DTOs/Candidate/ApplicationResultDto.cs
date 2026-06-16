using System.Text.Json.Serialization;
using JobHunter.Domain.Entities;

namespace JobHunter.Service.DTOs.Candidate;

public class ApplicationResultDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("jobId")]
    public Guid JobId { get; set; }

    [JsonPropertyName("resumeId")]
    public Guid? ResumeId { get; set; }

    [JsonPropertyName("coverLetter")]
    public string? CoverLetter { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("appliedAt")]
    public DateTimeOffset? AppliedAt { get; set; }

    public static ApplicationResultDto From(Application application) => new()
    {
        Id = application.Id,
        JobId = application.JobId,
        ResumeId = application.ResumeId,
        CoverLetter = application.CoverLetter,
        Status = application.Status?.ToString(),
        AppliedAt = application.AppliedAt
    };
}
