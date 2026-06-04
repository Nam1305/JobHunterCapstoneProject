using JobHunter.Domain;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Job;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;
using System.Text.Json;
using System.Text.Json.Nodes;

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

    public async Task<JobDetailDto> GetJobDetailsById(Guid uid)
    {
        var job = await _jobRepository.GetJobById(uid);
        if (job == null)
        {
            throw new KeyNotFoundException("Job not found");
        }

        return new JobDetailDto
        {
            Id = job.Id,
            Name = job.Title,
            SalaryRange = job.SalaryRange,
            JobWorkType = job.WorkType?.ToString(),
            ExpiredDate = job.ExpiredAt,
            Category = job.Subcategory?.CategoryId,
            SubCategory = job.SubcategoryId,
            Brand = job.CompanyId,
            ExperienceRequirement = job.ExperienceRequirement,
            Level = string.Join(", ", job.JobLevels.Select(level => level.Title).Where(title => !string.IsNullOrWhiteSpace(title))),
            Tag = job.Tags?.RootElement.ToString(),
            Requirements = ParseJsonValue(job.Requirements),
            Responsibilities = ParseJsonValue(job.Responsibilities),
            Benefits = ParseJsonValue(job.Benefits)
        };
    }

    private static JsonNode? ParseJsonValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        try
        {
            return JsonNode.Parse(value);
        }
        catch (JsonException)
        {
            return JsonValue.Create(value);
        }
    }
}
