namespace JobHunter.Service.DTOs.Company;

public class CompanyCardDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Slug { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverPhotoUrl { get; set; }
    public string? CompanyType { get; set; }
    public string? TeamSize { get; set; }
    public string? Country { get; set; }
    public int OpeningVacancies { get; set; }
    public int NumberOfFollowers { get; set; }
}
