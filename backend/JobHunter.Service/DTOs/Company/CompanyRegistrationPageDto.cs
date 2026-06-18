using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Company;

public class CompanyRegistrationPageDto
{
    public int Page { get; set; }

    public int Limit { get; set; }

    public int Total { get; set; }

    public int TotalPages => Limit == 0 ? 0 : (Total + Limit - 1) / Limit;

    public List<CompanyRegistrationDto> Data { get; set; } = [];
}
