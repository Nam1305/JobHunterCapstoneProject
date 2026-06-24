using JobHunter.Service.DTOs.Candidate;
using JobHunter.Service.Infrastructure.Persistence;
using JobHunter.Service.Interface.UseCase;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.UseCase;

public class FollowingUseCase : IFollowingUseCase
{
    private readonly JobhunterContext _context;

    public FollowingUseCase(JobhunterContext context)
    {
        _context = context;
    }

    public async Task FollowJob(Guid userId, Guid jobId)
    {
        var user = await _context.Users
            .Include(u => u.FollowingJobs)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (user.FollowingJobs.Any(job => job.Id == jobId))
        {
            return;
        }

        var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);
        if (job == null)
        {
            throw new KeyNotFoundException("Job not found");
        }

        user.FollowingJobs.Add(job);
        await _context.SaveChangesAsync();
    }

    public async Task FollowCompany(Guid userId, Guid companyId)
    {
        var user = await _context.Users
            .Include(u => u.FollowingCompanies)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (user.FollowingCompanies.Any(company => company.Id == companyId))
        {
            return;
        }

        var company = await _context.Companies.FirstOrDefaultAsync(c => c.Id == companyId);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        user.FollowingCompanies.Add(company);
        await _context.SaveChangesAsync();
    }

    public async Task<FollowingJobsLikedStatusDto> GetLikedJobStatus(Guid userId, List<Guid> jobIds)
    {
        var requestedJobIds = jobIds.Distinct().ToList();
        var likedJobIds = await _context.Users
            .Where(user => user.Id == userId)
            .SelectMany(user => user.FollowingJobs)
            .Where(job => requestedJobIds.Contains(job.Id))
            .Select(job => job.Id)
            .ToListAsync();

        var likedJobIdSet = likedJobIds.ToHashSet();

        return new FollowingJobsLikedStatusDto
        {
            LikedJobIds = requestedJobIds.Where(likedJobIdSet.Contains).ToList()
        };
    }

    public async Task<FollowingCompaniesLikedStatusDto> GetLikedCompanyStatus(Guid userId, List<Guid> companyIds)
    {
        var requestedCompanyIds = companyIds.Distinct().ToList();
        var likedCompanyIds = await _context.Users
            .Where(user => user.Id == userId)
            .SelectMany(user => user.FollowingCompanies)
            .Where(company => requestedCompanyIds.Contains(company.Id))
            .Select(company => company.Id)
            .ToListAsync();

        var likedCompanyIdSet = likedCompanyIds.ToHashSet();

        return new FollowingCompaniesLikedStatusDto
        {
            LikedCompanyIds = requestedCompanyIds.Where(likedCompanyIdSet.Contains).ToList()
        };
    }
}
