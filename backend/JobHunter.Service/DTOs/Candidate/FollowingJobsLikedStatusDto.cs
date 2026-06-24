using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Candidate;

public class FollowingJobsLikedStatusDto
{
    [JsonPropertyName("likedJobIds")]
    public List<Guid> LikedJobIds { get; set; } = [];
}
