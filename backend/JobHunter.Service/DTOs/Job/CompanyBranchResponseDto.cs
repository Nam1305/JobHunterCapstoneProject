namespace JobHunter.Service.DTOs.Job;

public class CompanyBranchResponseDto
{
    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string? Name { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? CitySlug { get; set; }
}
