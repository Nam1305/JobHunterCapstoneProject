namespace JobHunter.Service.DTOs.Job;

public class JobDetailsDto : JobCardDto
{
    public Guid CompanyId { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? SubcategoryId { get; set; }
    public int Applicants { get; set; }
    public string? Responsibilities { get; set; }
    public string? Requirements { get; set; }
    public string? Benefits { get; set; }
    public CompanyBranchResponseDto? Branch { get; set; }
}
