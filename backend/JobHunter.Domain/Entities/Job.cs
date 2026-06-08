using System.Text.Json;
using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class Job : BaseEntity
{
    public Guid CompanyId { get; set; }

    public Guid? BranchId { get; set; }

    public Guid? SubcategoryId { get; set; }

    public string? Title { get; set; }

    public string? SalaryRange { get; set; }

    public string? Responsibilities { get; set; }

    public string? Requirements { get; set; }

    public string? ExperienceRequirement { get; set; }

    public string? Benefits { get; set; }

    public JobWorkType? WorkType { get; set; }

    public DateTimeOffset? ExpiredAt { get; set; }

    public JsonDocument? Tags { get; set; }

    public string? Slug { get; set; }

    public virtual CompanyBranch? Branch { get; set; }

    public virtual Company Company { get; set; } = null!;

    public virtual JobSubcategory? Subcategory { get; set; }

    public virtual ICollection<JobLevel> JobLevels { get; set; } = new List<JobLevel>();

    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
}
