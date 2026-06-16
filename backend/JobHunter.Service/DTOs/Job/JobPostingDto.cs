using JobHunter.Domain;

namespace JobHunter.Service.DTOs.Job;

public class JobPostingDto
{
    public Guid Id { get; set; }

    public string? Title { get; set; }

    public DateTimeOffset? CreatedAt { get; set; }

    public DateTimeOffset? ExpiredAt { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }

    public JobStatus Status { get; set; }

    public int ApplicantCount { get; set; }
}
