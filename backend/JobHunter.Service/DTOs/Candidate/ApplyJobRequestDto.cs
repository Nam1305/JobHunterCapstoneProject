using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Candidate;

public class ApplyJobRequestDto
{
    [JsonPropertyName("resumeId")]
    public Guid ResumeId { get; set; }

    [JsonPropertyName("jobId")]
    public Guid JobId { get; set; }

    [Required]
    [EmailAddress]
    [StringLength(255)]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(255)]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;

    [JsonPropertyName("coverLetter")]
    public string? CoverLetter { get; set; }
}
