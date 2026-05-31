using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class JobCategory : BaseEntity
{
    public string? Name { get; set; }

    public string? Slug { get; set; }

    public virtual ICollection<JobSubcategory> JobSubcategories { get; set; } = new List<JobSubcategory>();
}
