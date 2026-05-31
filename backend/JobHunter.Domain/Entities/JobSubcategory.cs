using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class JobSubcategory : BaseEntity
{
    public Guid CategoryId { get; set; }

    public string? Name { get; set; }

    public string? Slug { get; set; }

    public virtual JobCategory Category { get; set; } = null!;

    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
}
