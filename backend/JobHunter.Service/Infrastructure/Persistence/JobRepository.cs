using JobHunter.Domain;
using JobHunter.Domain.Entities;
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

    public Task<List<Job>> GetJobs(Guid companyId, string? search, JobStatus? status, int page, int pageSize)
    {
        return BuildQuery(companyId, search, status)
            .OrderByDescending(job => job.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public Task<int> CountJobs(Guid companyId, string? search, JobStatus? status)
    {
        return BuildQuery(companyId, search, status).CountAsync();
    }

    private IQueryable<Job> BuildQuery(Guid companyId, string? search, JobStatus? status)
    {
        var query = _context.Jobs
            .AsNoTracking()
            .Where(job => job.CompanyId == companyId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(job => job.Title != null && EF.Functions.ILike(job.Title, $"%{search.Trim()}%"));
        }

        if (status.HasValue)
        {
            var now = DateTimeOffset.UtcNow;
            query = status.Value == JobStatus.Open
                ? query.Where(job => !job.ExpiredAt.HasValue || job.ExpiredAt > now)
                : query.Where(job => job.ExpiredAt.HasValue && job.ExpiredAt <= now);
        }

        return query;
    }
}
