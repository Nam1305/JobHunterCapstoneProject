namespace JobHunter.Service.DTOs.Job;

public class JobCardDto
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public string CompanyName { get; set; } = null!;
    public string? CompanyImage { get; set; }
    public string? SalaryRange { get; set; }
    public string? ExperienceRequirement { get; set; }
    public string? WorkType { get; set; }
    public DateTimeOffset? ExpiredAt { get; set; }
    public List<string> Tags { get; set; } = [];
    public string? Slug { get; set; }
    public string City { get; set; } = string.Empty;
    public List<string> JobLevels { get; set; } = [];
}
