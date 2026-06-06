using JobHunter.Domain;
using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Job;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Utils;
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
            throw new ArgumentException("User is not assigned to a company");
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

        return MapJobDetail(job);
    }

    public async Task<JobDetailDto> CreateJob(Guid userId, CreateJobRequestDto request)
    {
        if (request == null)
        {
            throw new ArgumentException("Request body is required");
        }

        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new ArgumentException("User is not assigned to a company");
        }

        var subcategory = await _jobRepository.GetSubcategoryById(request.SubCategory);
        if (subcategory == null || subcategory.CategoryId != request.Category)
        {
            throw new ArgumentException("Subcategory does not belong to category");
        }

        var branch = await _jobRepository.GetBranchById(user.CompanyId.Value, request.Branch);
        if (branch == null)
        {
            throw new KeyNotFoundException("Branch not found");
        }

        var distinctLevelIds = request.ExperienceLevels.Distinct().ToList();
        var levels = await _jobRepository.GetJobLevelsByIds(distinctLevelIds);
        if (levels.Count != distinctLevelIds.Count)
        {
            throw new ArgumentException("One or more experience levels are invalid");
        }

        var now = DateTimeOffset.UtcNow;
        var tags = request.Tags?
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToList() ?? new List<string>();

        var job = new Job
        {
            Id = Guid.NewGuid(),
            CompanyId = user.CompanyId.Value,
            BranchId = branch.Id,
            SubcategoryId = subcategory.Id,
            Title = request.Name,
            SalaryRange = request.SalaryRange,
            WorkType = request.JobWorkType,
            ExpiredAt = request.ExperiedDate!.Value.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc),
            ExperienceRequirement = request.ExperienceRequirement,
            Tags = JsonDocument.Parse(JsonSerializer.Serialize(tags)),
            Responsibilities = request.Responsibilities,
            Requirements = request.Requirements,
            Benefits = request.Benefits,
            Slug = $"{SlugGenerator.GenerateSlug(request.Name)}-{now.ToUnixTimeMilliseconds()}",
            CreatedAt = now,
            UpdatedAt = now,
            CreatedBy = userId.ToString(),
            UpdatedBy = userId.ToString()
        };

        foreach (var level in levels)
        {
            job.JobLevels.Add(level);
        }

        await _jobRepository.CreateJob(job);
        job.Subcategory = subcategory;

        return MapJobDetail(job);
    }

    private static JobDetailDto MapJobDetail(Job job)
    {
        return new JobDetailDto
        {
            Id = job.Id,
            Name = job.Title,
            SalaryRange = job.SalaryRange,
            JobWorkType = job.WorkType?.ToString(),
            ExpiredDate = job.ExpiredAt,
            Category = job.Subcategory?.CategoryId,
            SubCategory = job.SubcategoryId,
            Branch = job.CompanyId,
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
