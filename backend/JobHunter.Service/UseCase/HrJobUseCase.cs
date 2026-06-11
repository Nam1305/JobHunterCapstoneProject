using JobHunter.Domain;
using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Category;
using JobHunter.Service.DTOs.ExperienceLevel;
using JobHunter.Service.DTOs.Job;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Utils;
using System.Globalization;
using System.Text.Json;

namespace JobHunter.Service.UseCase;

public class HrJobUseCase : IHrJobUseCase
{
    private readonly IHrJobRepository _jobRepository;
    private readonly IUserRepository _userRepository;

    public HrJobUseCase(IHrJobRepository jobRepository, IUserRepository userRepository)
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

        return MapJobDetail(job);
    }

    public async Task<List<CategoryDto>> GetCategories()
    {
        var categories = await _jobRepository.GetCategoriesWithSubcategories();
        if (categories.Count == 0)
        {
            throw new KeyNotFoundException("Categories not found");
        }

        return categories.Select(category => new CategoryDto
        {
            Id = category.Id.ToString(),
            Name = category.Name ?? string.Empty,
            Subcategories = category.JobSubcategories
                .OrderBy(subcategory => subcategory.Name)
                .Select(subcategory => new SubcategoryDto
                {
                    Id = subcategory.Id.ToString(),
                    Name = subcategory.Name ?? string.Empty
                })
                .ToList()
        }).ToList();
    }

    public async Task<List<ExperienceLevelDto>> GetExperienceLevels()
    {
        var levels = await _jobRepository.GetExperienceLevels();
        if (levels.Count == 0)
        {
            throw new KeyNotFoundException("Experience levels not found");
        }

        return levels.Select(level => new ExperienceLevelDto
        {
            Id = level.Id,
            Name = level.Title ?? string.Empty
        }).ToList();
    }

    public async Task<JobDetailDto> CreateJob(Guid userId, CreateJobRequestDto request)
    {
        ValidateCreateJobRequest(request);

        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
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

        var expiredDate = ParseExpiredDate(request.ExperiedDate);
        var now = DateTimeOffset.UtcNow;
        var tags = NormalizeTags(request.Tags);

        var job = new Job
        {
            Id = Guid.NewGuid(),
            CompanyId = user.CompanyId.Value,
            BranchId = branch.Id,
            SubcategoryId = subcategory.Id,
            Title = request.Name,
            SalaryRange = request.SalaryRange,
            WorkType = request.JobWorkType,
            ExpiredAt = expiredDate,
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

    public async Task<JobDetailDto> UpdateJob(Guid userId, Guid uid, CreateJobRequestDto request)
    {
        ValidateCreateJobRequest(request);

        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var job = await _jobRepository.GetJobByIdForUpdate(uid);
        if (job == null || job.CompanyId != user.CompanyId.Value)
        {
            throw new KeyNotFoundException("Job not found");
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

        var expiredDate = ParseExpiredDate(request.ExperiedDate);
        var now = DateTimeOffset.UtcNow;
        var tags = NormalizeTags(request.Tags);
        var shouldUpdateSlug = !string.Equals(job.Title, request.Name, StringComparison.Ordinal);

        job.BranchId = branch.Id;
        job.SubcategoryId = subcategory.Id;
        job.Title = request.Name;
        job.SalaryRange = request.SalaryRange;
        job.WorkType = request.JobWorkType;
        job.ExpiredAt = expiredDate;
        job.ExperienceRequirement = request.ExperienceRequirement;
        job.Tags = JsonDocument.Parse(JsonSerializer.Serialize(tags));
        job.Responsibilities = request.Responsibilities;
        job.Requirements = request.Requirements;
        job.Benefits = request.Benefits;
        job.UpdatedAt = now;
        job.UpdatedBy = userId.ToString();

        if (shouldUpdateSlug)
        {
            job.Slug = $"{SlugGenerator.GenerateSlug(request.Name)}-{now.ToUnixTimeMilliseconds()}";
        }

        job.JobLevels.Clear();
        foreach (var level in levels)
        {
            job.JobLevels.Add(level);
        }

        await _jobRepository.SaveChanges();
        job.Subcategory = subcategory;

        return MapJobDetail(job);
    }

    public async Task<JobDetailDto> CloseJob(Guid userId, Guid uid)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var job = await _jobRepository.GetJobByIdForUpdate(uid);
        if (job == null || job.CompanyId != user.CompanyId.Value)
        {
            throw new KeyNotFoundException("Job not found");
        }

        var now = DateTimeOffset.UtcNow;
        job.ExpiredAt = now.AddMinutes(-1);
        job.UpdatedAt = now;
        job.UpdatedBy = userId.ToString();

        await _jobRepository.SaveChanges();

        return MapJobDetail(job);
    }

    private static void ValidateCreateJobRequest(CreateJobRequestDto? request)
    {
        if (request == null)
        {
            throw new ArgumentException("Request body is required");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            throw new ArgumentException("Job name is required");
        }

        if (!request.JobWorkType.HasValue)
        {
            throw new ArgumentException("Job work type is required");
        }

        if (string.IsNullOrWhiteSpace(request.ExperiedDate))
        {
            throw new ArgumentException("Expired date is required");
        }

        if (request.Category == Guid.Empty)
        {
            throw new ArgumentException("Category is required");
        }

        if (request.SubCategory == Guid.Empty)
        {
            throw new ArgumentException("Subcategory is required");
        }

        if (request.Branch == Guid.Empty)
        {
            throw new ArgumentException("Branch is required");
        }

        if (request.ExperienceLevels == null || request.ExperienceLevels.Count == 0)
        {
            throw new ArgumentException("At least one experience level is required");
        }

        if (request.ExperienceLevels.Any(levelId => levelId == Guid.Empty))
        {
            throw new ArgumentException("One or more experience levels are invalid");
        }
    }

    private static List<string> NormalizeTags(IEnumerable<string>? tags)
    {
        return tags?
            .Select(tag => tag.Trim())
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .ToList() ?? new List<string>();
    }

    private static List<string> ReadTags(JsonDocument? tags)
    {
        if (tags == null || tags.RootElement.ValueKind != JsonValueKind.Array)
        {
            return new List<string>();
        }

        return tags.RootElement
            .EnumerateArray()
            .Where(tag => tag.ValueKind == JsonValueKind.String)
            .Select(tag => tag.GetString()?.Trim())
            .Where(tag => !string.IsNullOrWhiteSpace(tag))
            .Select(tag => tag!)
            .ToList();
    }

    private static DateTimeOffset ParseExpiredDate(string? expiredDate)
    {
        if (string.IsNullOrWhiteSpace(expiredDate))
        {
            throw new ArgumentException("Expired date is required");
        }

        var trimmedDate = expiredDate.Trim();
        if (DateOnly.TryParseExact(trimmedDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateOnly))
        {
            return new DateTimeOffset(dateOnly.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
        }

        var normalizedDate = NormalizeTimezoneOffset(trimmedDate);
        if (DateTimeOffset.TryParse(
                normalizedDate,
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal,
                out var dateTimeOffset))
        {
            return dateTimeOffset.ToUniversalTime();
        }

        throw new ArgumentException("Expired date is invalid");
    }

    private static string NormalizeTimezoneOffset(string date)
    {
        if (date.Length < 5)
        {
            return date;
        }

        var offsetStart = date.Length - 5;
        var sign = date[offsetStart];
        if ((sign != '+' && sign != '-')
            || !char.IsDigit(date[offsetStart + 1])
            || !char.IsDigit(date[offsetStart + 2])
            || !char.IsDigit(date[offsetStart + 3])
            || !char.IsDigit(date[offsetStart + 4]))
        {
            return date;
        }

        return $"{date[..(offsetStart + 3)]}:{date[(offsetStart + 3)..]}";
    }

    private static JobDetailDto MapJobDetail(Job job)
    {
        return new JobDetailDto
        {
            Id = job.Id,
            Name = job.Title,
            SalaryRange = job.SalaryRange,
            JobWorkType = job.WorkType,
            ExperiedDate = job.ExpiredAt?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            Category = job.Subcategory?.CategoryId ?? Guid.Empty,
            SubCategory = job.SubcategoryId ?? Guid.Empty,
            Branch = job.BranchId ?? Guid.Empty,
            ExperienceLevels = job.JobLevels.Select(level => level.Id).ToList(),
            ExperienceRequirement = job.ExperienceRequirement,
            Tags = ReadTags(job.Tags),
            Requirements = job.Requirements,
            Responsibilities = job.Responsibilities,
            Benefits = job.Benefits
        };
    }
}
