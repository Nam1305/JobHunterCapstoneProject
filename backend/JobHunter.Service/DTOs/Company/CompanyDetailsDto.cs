using JobHunter.Service.DTOs.Job;

namespace JobHunter.Service.DTOs.Company;

public class CompanyDetailsDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? Country { get; set; }
    public string? CompanyType { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverPhotoUrl { get; set; }
    public string? Overview { get; set; }
    public string? Benefits { get; set; }
    public List<string> TeamPhotoUrls { get; set; } = [];
    public string? TeamSize { get; set; }
    public string? Slug { get; set; }
    public List<CompanyBranchResponseDto> CompanyBranches { get; set; } = [];
}
