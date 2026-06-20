using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Company;

public class CompanyRegistrationDetailDto
{
    public Guid Id { get; set; }

    public string? HrName { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? CompanyName { get; set; }

    public string? WebsiteUrl { get; set; }

    public string? TaxCode { get; set; }

    public string Status { get; set; } = null!;

    public string? Country { get; set; }

    public string? CompanyType { get; set; }

    public string? TeamSize { get; set; }

    public string? Overview { get; set; }

    public DateTimeOffset? CreatedAt { get; set; }
}
