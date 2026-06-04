using JobHunter.Domain;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Job;

namespace JobHunter.Service.Interface.UseCase;

public interface IJobUseCase
{
    Task<PageResult<JobPostingDto>> GetJobs(Guid userId, string? search, JobStatus? status, int page, int pageSize);
}
