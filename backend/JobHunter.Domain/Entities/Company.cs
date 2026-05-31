using System.Text.Json;
using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class Company : BaseEntity
{
    public string? Name { get; set; }

    public string? WebsiteUrl { get; set; }

    public string? Country { get; set; }

    public string? CompanyType { get; set; }

    public string? LogoUrl { get; set; }

    public string? CoverPhotoUrl { get; set; }

    public string? Overview { get; set; }

    public string? Benefits { get; set; }

    public JsonDocument? TeamPhotoUrls { get; set; }

    public string? TeamSize { get; set; }

    public string? Slug { get; set; }

    public virtual ICollection<CompanyBranch> CompanyBranches { get; set; } = new List<CompanyBranch>();

    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
