using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs.HR;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence;

public class JobRepository : IJobRepository
{
    private readonly JobhunterContext _context;

    public JobRepository(JobhunterContext context)
    {
        _context = context;
    }

    public Task<List<Job>> GetTopJobs(int limit)
    {
        var now = DateTimeOffset.UtcNow;

        return _context.Jobs
            .AsNoTracking()
            .Include(j => j.Company)
            .Include(j => j.Branch)
            .Include(j => j.JobLevels)
            .Where(j => j.ExpiredAt == null || j.ExpiredAt > now)
            .OrderByDescending(j => j.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<(List<Job> Items, int TotalCount)> GetJobs(
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
        var now = DateTimeOffset.UtcNow;
        var query = _context.Jobs
            .AsNoTracking()
            .Include(j => j.Company)
            .Include(j => j.Branch)
            .Include(j => j.JobLevels)
            .Include(j => j.Subcategory)
                .ThenInclude(s => s != null ? s.Category : null)
            .Where(j => j.ExpiredAt == null || j.ExpiredAt > now)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(j => EF.Functions.ILike(j.Title, $"%{search.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(location))
            query = query.Where(j => j.Branch != null && EF.Functions.ILike(j.Branch.City, $"%{location.Trim()}%"));

        if (!string.IsNullOrWhiteSpace(companySlug))
            query = query.Where(j => j.Company.Slug == companySlug);

        if (categorySlugs.Count > 0)
            query = query.Where(j => j.Subcategory != null && categorySlugs.Contains(j.Subcategory.Category.Slug));

        if (subcategorySlugs.Count > 0)
            query = query.Where(j => j.Subcategory != null && subcategorySlugs.Contains(j.Subcategory.Slug));

        if (levelSlugs.Count > 0)
            query = query.Where(j => j.JobLevels.Any(jl => levelSlugs.Contains(jl.Slug)));

        if (workTypes.Count > 0)
            query = query.Where(j => j.WorkType != null && workTypes.Contains(j.WorkType.ToString()));

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<Job?> GetJobBySlug(string slug)
    {
        var now = DateTimeOffset.UtcNow;

        return _context.Jobs
            .AsNoTracking()
            .Include(j => j.Company)
            .Include(j => j.Branch)
            .Include(j => j.JobLevels)
            .Include(j => j.Subcategory)
            .FirstOrDefaultAsync(j => j.Slug == slug && (j.ExpiredAt == null || j.ExpiredAt > now));
    }

    public async Task<List<Job>?> GetJobSuggestions(Guid jobId, int limit)
    {
        var now = DateTimeOffset.UtcNow;
        var sourceJob = await _context.Jobs
            .AsNoTracking()
            .Include(j => j.JobLevels)
            .FirstOrDefaultAsync(j =>
                j.Id == jobId && (j.ExpiredAt == null || j.ExpiredAt > now));

        if (sourceJob == null)
        {
            return null;
        }

        var sourceLevelIds = sourceJob.JobLevels.Select(level => level.Id).ToList();
        var query = _context.Jobs
            .AsNoTracking()
            .Include(j => j.Company)
            .Include(j => j.Branch)
            .Include(j => j.JobLevels)
            .Where(j =>
                j.Id != jobId &&
                (j.ExpiredAt == null || j.ExpiredAt > now));

        if (sourceJob.SubcategoryId.HasValue && sourceLevelIds.Count > 0)
        {
            query = query.Where(j =>
                j.SubcategoryId == sourceJob.SubcategoryId ||
                j.JobLevels.Any(level => sourceLevelIds.Contains(level.Id)));
        }
        else if (sourceJob.SubcategoryId.HasValue)
        {
            query = query.Where(j => j.SubcategoryId == sourceJob.SubcategoryId);
        }
        else if (sourceLevelIds.Count > 0)
        {
            query = query.Where(j => j.JobLevels.Any(level => sourceLevelIds.Contains(level.Id)));
        }
        else
        {
            return [];
        }

        return await query
            .OrderByDescending(j => j.SubcategoryId == sourceJob.SubcategoryId)
            .ThenByDescending(j => j.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<JobFilterOptionsData> GetFilterOptions()
    {
        var categories = await _context.JobCategories
            .AsNoTracking()
            .Include(c => c.JobSubcategories)
            .OrderBy(c => c.Name)
            .ToListAsync();

        var levels = await _context.JobLevels
            .AsNoTracking()
            .OrderBy(l => l.Title)
            .ToListAsync();

        var workTypes = await _context.Jobs
            .AsNoTracking()
            .Where(j => j.WorkType != null)
            .Select(j => j.WorkType!.ToString())
            .Distinct()
            .ToListAsync();

        var locations = await _context.CompanyBranches
            .AsNoTracking()
            .Where(b => b.City != null)
            .Select(b => b.City!)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return new JobFilterOptionsData(categories, levels, workTypes!, locations);
    }
    public Task<List<JobItemDto>> GetHrJobs(Guid companyId, string? search, string? status, int page, int pageSize)
    {
        var now = DateTimeOffset.UtcNow;
        var query = _context.Jobs.Where(j => j.CompanyId == companyId);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(j => j.Title != null && j.Title.Contains(search));

        if (status == "Active")
            query = query.Where(j => j.ExpiredAt == null || j.ExpiredAt > now);
        else if (status == "Expired")
            query = query.Where(j => j.ExpiredAt != null && j.ExpiredAt <= now);

        return query
            .OrderByDescending(j => j.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(j => new JobItemDto
            {
                Id = j.Id,
                Title = j.Title,
                Slug = j.Slug,
                ApplicationCount = j.Applications.Count()
            })
            .ToListAsync();
    }

    public Task<int> CountHrJobs(Guid companyId, string? search, string? status)
    {
        var now = DateTimeOffset.UtcNow;
        var query = _context.Jobs.Where(j => j.CompanyId == companyId);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(j => j.Title != null && j.Title.Contains(search));

        if (status == "Active")
            query = query.Where(j => j.ExpiredAt == null || j.ExpiredAt > now);
        else if (status == "Expired")
            query = query.Where(j => j.ExpiredAt != null && j.ExpiredAt <= now);

        return query.CountAsync();
    }

    public Task<bool> IsJobOwnedByCompany(Guid jobId, Guid companyId)
    {
        return _context.Jobs.AnyAsync(j => j.Id == jobId && j.CompanyId == companyId);
    }

    public Task<Guid?> GetJobIdBySlug(string slug)
    {
        return _context.Jobs
            .Where(j => j.Slug == slug)
            .Select(j => (Guid?)j.Id)
            .FirstOrDefaultAsync();
    }

    public Task<bool> IsJobExists(Guid jobId)
    {
        return _context.Jobs.AnyAsync(j => j.Id == jobId);
    }
}
