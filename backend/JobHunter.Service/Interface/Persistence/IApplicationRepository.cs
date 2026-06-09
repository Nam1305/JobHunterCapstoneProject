using JobHunter.Service.DTOs.HR;

namespace JobHunter.Service.Interface.Persistence;

public interface IApplicationRepository
{
    Task<List<CandidateDto>> GetCandidatesByJob(Guid jobId, string? status, int page, int pageSize);
    Task<int> CountCandidatesByJob(Guid jobId, string? status);
}
