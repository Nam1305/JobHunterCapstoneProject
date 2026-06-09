using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.HR;

namespace JobHunter.Service.Interface.UseCase;

public interface IHRDashboardUseCase
{
    Task<PageResult<JobItemDto>> GetJobs(Guid userId, string? search, string? status, int page, int pageSize);
    Task<PageResult<CandidateDto>> GetCandidates(Guid userId, Guid jobId, string? status, int page, int pageSize);
}
