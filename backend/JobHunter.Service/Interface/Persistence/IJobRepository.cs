using JobHunter.Domain;
using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence;

public interface IJobRepository
{
    Task<List<Job>> GetJobs(Guid companyId, string? search, JobStatus? status, int page, int pageSize);

    Task<int> CountJobs(Guid companyId, string? search, JobStatus? status);
}
