using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Candidate;

public class FollowingToggleResultDto
{
    [JsonPropertyName("isLiked")]
    public bool IsLiked { get; set; }
}
