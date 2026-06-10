using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.HR;

public class JobItemDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("slug")]
    public string? Slug { get; set; }

    [JsonPropertyName("applicationCount")]
    public int ApplicationCount { get; set; }
}
