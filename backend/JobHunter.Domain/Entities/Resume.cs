using JobHunter.Domain;
using Pgvector;

namespace JobHunter.Domain.Entities;

public partial class Resume : BaseEntity
{
    public Guid UserId { get; set; }

    public string? FileUrl { get; set; }

    public bool IsPublic { get; set; }

    public Vector? ResumeEmbedding { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
}
