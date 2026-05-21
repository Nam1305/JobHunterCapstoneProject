using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class User : BaseEntity
{
    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string Email { get; set; } = null!;

    public string? GoogleId { get; set; }

    public string Password { get; set; } = null!;

    public string? Avatar { get; set; }

    public UserRole? Role { get; set; }

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
