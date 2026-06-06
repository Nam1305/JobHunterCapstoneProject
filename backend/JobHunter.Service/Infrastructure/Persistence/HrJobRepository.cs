using JobHunter.Domain;
using JobHunter.Domain.Entities;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence;

public class HrJobRepository : IHrJobRepository
{
    private readonly JobhunterContext _context;

    public HrJobRepository(JobhunterContext context)
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

    public Task<Job?> GetJobById(Guid id)
    {
        return _context.Jobs
            .AsNoTracking()
            .Include(job => job.Subcategory)
            .Include(job => job.JobLevels)
            .FirstOrDefaultAsync(job => job.Id == id);
    }

    public Task<Job?> GetJobByIdForUpdate(Guid id)
    {
        return _context.Jobs
            .Include(job => job.Subcategory)
            .Include(job => job.JobLevels)
            .FirstOrDefaultAsync(job => job.Id == id);
    }

    public Task<JobSubcategory?> GetSubcategoryById(Guid id)
    {
        return _context.JobSubcategories
            .AsNoTracking()
            .FirstOrDefaultAsync(subcategory => subcategory.Id == id);
    }

    public Task<CompanyBranch?> GetBranchById(Guid companyId, Guid branchId)
    {
        return _context.CompanyBranches
            .AsNoTracking()
            .FirstOrDefaultAsync(branch => branch.CompanyId == companyId && branch.Id == branchId);
    }

    public Task<List<JobLevel>> GetJobLevelsByIds(List<Guid> ids)
    {
        return _context.JobLevels
            .Where(level => ids.Contains(level.Id))
            .ToListAsync();
    }

    public async Task CreateJob(Job job)
    {
        await _context.Jobs.AddAsync(job);
        await _context.SaveChangesAsync();
    }

    public Task SaveChanges()
    {
        return _context.SaveChangesAsync();
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
