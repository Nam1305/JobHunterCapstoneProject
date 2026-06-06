using JobHunter.Domain;
using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence;

public interface IHrJobRepository
{
    Task<List<Job>> GetJobs(Guid companyId, string? search, JobStatus? status, int page, int pageSize);

    Task<int> CountJobs(Guid companyId, string? search, JobStatus? status);

    Task<Job?> GetJobById(Guid id);

    Task<Job?> GetJobByIdForUpdate(Guid id);

    Task<JobSubcategory?> GetSubcategoryById(Guid id);

    Task<CompanyBranch?> GetBranchById(Guid companyId, Guid branchId);

    Task<List<JobLevel>> GetJobLevelsByIds(List<Guid> ids);

    Task CreateJob(Job job);

    Task SaveChanges();
}
