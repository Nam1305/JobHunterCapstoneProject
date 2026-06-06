using JobHunter.Domain;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Job;

namespace JobHunter.Service.Interface.UseCase;

public interface IHrJobUseCase
{
    Task<PageResult<JobPostingDto>> GetJobs(Guid userId, string? search, JobStatus? status, int page, int pageSize);

    Task<JobDetailDto> GetJobDetailsById(Guid uid);

    Task<JobDetailDto> CreateJob(Guid userId, CreateJobRequestDto request);

    Task<JobDetailDto> UpdateJob(Guid userId, Guid uid, CreateJobRequestDto request);
}
