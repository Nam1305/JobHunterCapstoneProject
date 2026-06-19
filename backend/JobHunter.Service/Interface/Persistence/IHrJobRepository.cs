using JobHunter.Domain;
using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs.Category;
using JobHunter.Service.DTOs.ExperienceLevel;
using JobHunter.Service.DTOs.Job;

namespace JobHunter.Service.Interface.Persistence;

public interface IHrJobRepository
{
    Task<List<JobPostingDto>> GetJobs(Guid companyId, string? search, JobStatus? status, int page, int pageSize);

    Task<int> CountJobs(Guid companyId, string? search, JobStatus? status);

    Task<Job?> GetJobById(Guid id);

    Task<Job?> GetJobByIdForUpdate(Guid id);

    Task<Job?> GetJobByIdForClose(Guid id);

    Task<List<CategoryDto>> GetCategoriesWithSubcategories();

    Task<JobSubcategory?> GetSubcategoryById(Guid id);

    Task<CompanyBranch?> GetBranchById(Guid companyId, Guid branchId);

    Task<List<ExperienceLevelDto>> GetExperienceLevels();

    Task<List<JobLevel>> GetJobLevelsByIds(List<Guid> ids);

    Task CreateJob(Job job);

    Task SaveChanges();
}
