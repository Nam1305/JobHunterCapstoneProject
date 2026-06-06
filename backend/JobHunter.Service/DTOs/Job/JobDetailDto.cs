namespace JobHunter.Service.DTOs.Job;

public class JobDetailDto
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public string? SalaryRange { get; set; }

    public string? JobWorkType { get; set; }

    public DateTimeOffset? ExpiredDate { get; set; }

    public Guid? Category { get; set; }

    public Guid? SubCategory { get; set; }

    public Guid Branch { get; set; }

    public string? ExperienceRequirement { get; set; }

    public string? Level { get; set; }

    public string? Tag { get; set; }

    public string? Requirements { get; set; }

    public string? Responsibilities { get; set; }

    public string? Benefits { get; set; }
}
