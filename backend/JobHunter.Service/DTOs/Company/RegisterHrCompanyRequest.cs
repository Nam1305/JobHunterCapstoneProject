using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Company;

public class RegisterHrCompanyRequest
{
    public string HrName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public string Password { get; set; } = null!;

    public string CompanyName { get; set; } = null!;

    public string? WebsiteUrl { get; set; }

    public string? TaxCode { get; set; }

    public string? Country { get; set; }

    public string? CompanyType { get; set; }

    public string? TeamSize { get; set; }

    public string? Overview { get; set; }
}
