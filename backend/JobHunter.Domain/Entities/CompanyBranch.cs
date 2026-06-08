using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class CompanyBranch : BaseEntity
{
    public Guid CompanyId { get; set; }

    public string? Name { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? CitySlug { get; set; }

    public bool IsDelete { get; set; } = false;

    public virtual Company Company { get; set; } = null!;

    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
}
