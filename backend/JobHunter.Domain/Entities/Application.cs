using JobHunter.Domain;
using JobHunter.Domain.Enums;

namespace JobHunter.Domain.Entities;

public partial class Application : BaseEntity
{
    public Guid? ResumeId { get; set; }

    public Guid JobId { get; set; }

    public string? CoverLetter { get; set; }

    public ApplicationStatus? Status { get; set; }

    public decimal? MatchScore { get; set; }

    public string? AiSuggestion { get; set; }

    public DateTimeOffset? AppliedAt { get; set; }

    public virtual Resume? Resume { get; set; }

    public virtual Job Job { get; set; } = null!;
}
