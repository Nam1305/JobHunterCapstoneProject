using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Company;

public class CompanyRegistrationDto
{
    public Guid Id { get; set; }

    public string? HrName { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? CompanyName { get; set; }

    public string? WebsiteUrl { get; set; }

    public string Status { get; set; } = null!;

    public DateTimeOffset? CreateAt { get; set; }
}
