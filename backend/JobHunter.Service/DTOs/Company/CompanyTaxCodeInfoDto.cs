using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Company;

public class CompanyTaxCodeInfoDto
{
    public string? Name { get; set; }

    public string? InternationalName { get; set; }

    public string? ShortName { get; set; }

    public string? Address { get; set; }

    public string? Status { get; set; }
}
