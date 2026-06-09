using System.Text.Json;
using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Job;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;

namespace JobHunter.Service.UseCase;

public class JobUseCase : IJobUseCase
{
    private readonly IJobRepository _jobRepository;

    public JobUseCase(IJobRepository jobRepository)
    {
        _jobRepository = jobRepository;
    }

    public async Task<List<JobCardDto>> GetTopJobs(int limit)
    {
        var jobs = await _jobRepository.GetTopJobs(limit);
        return jobs.Select(ToJobCard).ToList();
    }

    public async Task<PageResult<JobDetailsDto>> GetJobs(
        string? search,
        string? location,
        string? companySlug,
        List<string> categorySlugs,
        List<string> subcategorySlugs,
        List<string> levelSlugs,
        List<string> workTypes,
        int page,
        int pageSize)
    {
        if (page < 1) throw new ArgumentException("Page must be greater than 0");
        if (pageSize < 1) throw new ArgumentException("Page size must be greater than 0");

        var (items, totalCount) = await _jobRepository.GetJobs(
            search, location, companySlug,
            categorySlugs, subcategorySlugs, levelSlugs, workTypes,
            page, pageSize);

        return new PageResult<JobDetailsDto>
        {
            Items = items.Select(ToJobDetails).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<JobDetailsDto> GetJobBySlug(string slug)
    {
        var job = await _jobRepository.GetJobBySlug(slug);
        if (job == null) throw new KeyNotFoundException("Job not found");
        return ToJobDetails(job);
    }

    public async Task<JobFilterOptionsDto> GetFilterOptions()
    {
        var data = await _jobRepository.GetFilterOptions();

        return new JobFilterOptionsDto
        {
            Categories = data.Categories.Select(c => new CategoryOptionDto
            {
                Name = c.Name ?? string.Empty,
                Slug = c.Slug ?? string.Empty,
                Subcategories = c.JobSubcategories.Select(s => new SubcategoryOptionDto
                {
                    Name = s.Name ?? string.Empty,
                    Slug = s.Slug ?? string.Empty
                }).ToList()
            }).ToList(),
            Levels = data.Levels.Select(l => new LevelOptionDto
            {
                Name = l.Title ?? string.Empty,
                Slug = l.Slug ?? string.Empty
            }).ToList(),
            WorkTypes = data.WorkTypes,
            Locations = data.Locations
        };
    }

    private static JobCardDto ToJobCard(Job job) => new()
    {
        Id = job.Id,
        Title = job.Title,
        CompanyName = job.Company.Name ?? string.Empty,
        CompanyImage = job.Company.LogoUrl,
        SalaryRange = job.SalaryRange,
        ExperienceRequirement = job.ExperienceRequirement,
        WorkType = job.WorkType?.ToString(),
        ExpiredAt = job.ExpiredAt,
        Tags = ParseTags(job),
        Slug = job.Slug,
        City = job.Branch?.City ?? string.Empty,
        JobLevels = job.JobLevels.Select(jl => jl.Title ?? string.Empty).ToList()
    };

    private static JobDetailsDto ToJobDetails(Job job) => new()
    {
        Id = job.Id,
        Title = job.Title,
        CompanyName = job.Company.Name ?? string.Empty,
        CompanyImage = job.Company.LogoUrl,
        SalaryRange = job.SalaryRange,
        ExperienceRequirement = job.ExperienceRequirement,
        WorkType = job.WorkType?.ToString(),
        ExpiredAt = job.ExpiredAt,
        Tags = ParseTags(job),
        Slug = job.Slug,
        City = job.Branch?.City ?? string.Empty,
        JobLevels = job.JobLevels.Select(jl => jl.Title ?? string.Empty).ToList(),
        CompanyId = job.CompanyId,
        BranchId = job.BranchId,
        SubcategoryId = job.SubcategoryId,
        SubcategorySlug = job.Subcategory?.Slug,
        Applicants = 0,
        Responsibilities = job.Responsibilities,
        Requirements = job.Requirements,
        Benefits = job.Benefits,
        Branch = job.Branch == null ? null : new CompanyBranchResponseDto
        {
            Id = job.Branch.Id,
            CompanyId = job.Branch.CompanyId,
            Name = job.Branch.Name,
            Address = job.Branch.Address,
            City = job.Branch.City,
            CitySlug = job.Branch.CitySlug
        }
    };

    private static List<string> ParseTags(Job job)
    {
        if (job.Tags == null) return [];
        try
        {
            return job.Tags.RootElement.EnumerateArray()
                .Select(e => e.GetString() ?? string.Empty)
                .Where(s => !string.IsNullOrEmpty(s))
                .ToList();
        }
        catch (InvalidOperationException)
        {
            return [];
        }
    }
}
