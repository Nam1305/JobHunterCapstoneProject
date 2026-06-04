using JobHunter.Domain;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Job;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;

namespace JobHunter.Service.UseCase;

public class JobUseCase : IJobUseCase
{
    private readonly IJobRepository _jobRepository;
    private readonly IUserRepository _userRepository;

    public JobUseCase(IJobRepository jobRepository, IUserRepository userRepository)
    {
        _jobRepository = jobRepository;
        _userRepository = userRepository;
    }

    public async Task<PageResult<JobPostingDto>> GetJobs(
        Guid userId,
        string? search,
        JobStatus? status,
        int page,
        int pageSize)
    {
        if (page < 1)
        {
            throw new ArgumentException("Page must be greater than 0");
        }

        if (pageSize < 1)
        {
            throw new ArgumentException("Page size must be greater than 0");
        }

        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var jobs = await _jobRepository.GetJobs(user.CompanyId.Value, search, status, page, pageSize);
        var totalCount = await _jobRepository.CountJobs(user.CompanyId.Value, search, status);
        var now = DateTimeOffset.UtcNow;

        return new PageResult<JobPostingDto>
        {
            Items = jobs.Select(job => new JobPostingDto
            {
                Id = job.Id,
                Title = job.Title,
                CreatedAt = job.CreatedAt,
                ExpiredAt = job.ExpiredAt,
                UpdatedAt = job.UpdatedAt,
                Status = !job.ExpiredAt.HasValue || job.ExpiredAt > now
                    ? JobStatus.Open
                    : JobStatus.Closed,
                ApplicantCount = 0
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }
}
