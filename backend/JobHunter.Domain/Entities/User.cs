using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class User : BaseEntity
{
    public string Name { get; set; } = null!;
    
    public Guid? CompanyId { get; set; }

    public string? Phone { get; set; }

    public string Email { get; set; } = null!;

    public string? GoogleId { get; set; }

    public bool IsDelete { get; set; } = false;

    public string Password { get; set; } = null!;

    public string? Avatar { get; set; }

    public UserRole? Role { get; set; }

    public virtual Company? Company { get; set; }

    public virtual ICollection<Job> FollowingJobs { get; set; } = new List<Job>();

    public virtual ICollection<Company> FollowingCompanies { get; set; } = new List<Company>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();
}
