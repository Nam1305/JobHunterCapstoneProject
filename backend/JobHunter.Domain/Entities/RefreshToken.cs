using JobHunter.Domain;

namespace JobHunter.Domain.Entities;

public partial class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }

    public string Token { get; set; } = null!;

    public DateTime ExpiresAt { get; set; }

    public virtual User User { get; set; } = null!;
}
