namespace JobHunter.Domain;

public class BaseEntity
{
    public Guid Id { get; set; }

    private DateTimeOffset? _createdAt = DateTimeOffset.UtcNow;
    private DateTimeOffset? _updatedAt = DateTimeOffset.UtcNow;

    public DateTimeOffset? CreatedAt
    {
        get => _createdAt;
        set => _createdAt = value?.ToUniversalTime();
    }

    public DateTimeOffset? UpdatedAt
    {
        get => _updatedAt;
        set => _updatedAt = value?.ToUniversalTime();
    }

    public string? CreatedBy { get; set; }

    public string? UpdatedBy { get; set; }
}
