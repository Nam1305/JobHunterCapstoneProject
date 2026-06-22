using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Candidate;

public class UpdateResumeStatusRequestDto
{
    [JsonPropertyName("isLookingForJob")]
    public bool IsLookingForJob { get; set; }
}
