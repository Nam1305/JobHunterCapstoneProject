using JobHunter.Domain;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Category;
using JobHunter.Service.DTOs.ExperienceLevel;
using JobHunter.Service.DTOs.Job;

namespace JobHunter.Service.Interface.UseCase;

public interface IHrJobUseCase
{
    Task<PageResult<JobPostingDto>> GetJobs(Guid userId, string? search, JobStatus? status, int page, int pageSize);

    Task<JobDetailDto> GetJobDetailsById(Guid uid);

    Task<Guid> CreateJob(Guid userId, CreateJobRequestDto request);

    Task UpdateJob(Guid userId, Guid uid, CreateJobRequestDto request);

    Task CloseJob(Guid userId, Guid uid);

    Task<List<CategoryDto>> GetCategories();

    Task<List<ExperienceLevelDto>> GetExperienceLevels();
}
