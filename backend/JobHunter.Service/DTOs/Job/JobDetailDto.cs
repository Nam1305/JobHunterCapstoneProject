using System.Text.Json.Nodes;

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

    public Guid Brand { get; set; }

    public string? ExperienceRequirement { get; set; }

    public string? Level { get; set; }

    public string? Tag { get; set; }

    public JsonNode? Requirements { get; set; }

    public JsonNode? Responsibilities { get; set; }

    public JsonNode? Benefits { get; set; }
}
