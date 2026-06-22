using System.Text.Json.Serialization;
using JobHunter.Domain.Entities;

namespace JobHunter.Service.DTOs.Candidate;

public class ResumeDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("fileName")]
    public string? FileName { get; set; }

    [JsonPropertyName("fileUrl")]
    public string? FileUrl { get; set; }

    [JsonPropertyName("createdDate")]
    public DateTimeOffset? CreatedDate { get; set; }

    [JsonPropertyName("isLookingForJob")]
    public bool IsLookingForJob { get; set; }

    public static ResumeDto From(Resume resume) => new()
    {
        Id = resume.Id,
        FileName = resume.FileName,
        FileUrl = resume.FileUrl,
        CreatedDate = resume.CreatedAt,
        IsLookingForJob = resume.IsPublic
    };
}
