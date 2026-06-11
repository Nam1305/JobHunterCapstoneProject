using JobHunter.Domain;

namespace JobHunter.Service.DTOs.Job;

public class CreateJobRequestDto
{
    public string? Name { get; set; }

    public string? SalaryRange { get; set; }

    public string? JobWorkType { get; set; }

    public string? ExperiedDate { get; set; }

    public Guid Category { get; set; }

    public Guid SubCategory { get; set; }

    public Guid Branch { get; set; }

    public List<Guid> ExperienceLevels { get; set; } = new();

    public string? ExperienceRequirement { get; set; }

    public List<string> Tags { get; set; } = new List<string>();

    public string? Responsibilities { get; set; }

    public string? Requirements { get; set; }

    public string? Benefits { get; set; }
}
