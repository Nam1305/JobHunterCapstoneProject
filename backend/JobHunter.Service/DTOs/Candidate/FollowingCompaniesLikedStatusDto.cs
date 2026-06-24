using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Candidate;

public class FollowingCompaniesLikedStatusDto
{
    [JsonPropertyName("likedCompanyIds")]
    public List<Guid> LikedCompanyIds { get; set; } = [];
}
