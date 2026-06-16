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
