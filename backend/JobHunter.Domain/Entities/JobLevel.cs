using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class JobLevel : BaseEntity
{
    public string? Title { get; set; }

    public string? Slug { get; set; }

    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
}
