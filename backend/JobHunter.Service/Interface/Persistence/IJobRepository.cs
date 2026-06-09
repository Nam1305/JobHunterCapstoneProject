using JobHunter.Service.DTOs.HR;

namespace JobHunter.Service.Interface.Persistence;

public interface IJobRepository
{
    Task<List<JobItemDto>> GetHrJobs(Guid companyId, string? search, string? status, int page, int pageSize);
    Task<int> CountHrJobs(Guid companyId, string? search, string? status);
    Task<bool> IsJobOwnedByCompany(Guid jobId, Guid companyId);
}
