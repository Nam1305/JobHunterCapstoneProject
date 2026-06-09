using JobHunter.Domain.Enums;
using JobHunter.Service.DTOs.HR;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence;

public class ApplicationRepository : IApplicationRepository
{
    private readonly JobhunterContext _context;

    public ApplicationRepository(JobhunterContext context)
    {
        _context = context;
    }

    public Task<List<CandidateDto>> GetCandidatesByJob(Guid jobId, string? status, int page, int pageSize)
    {
        var query = _context.Applications.Where(a => a.JobId == jobId);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ApplicationStatus>(status, out var statusEnum))
            query = query.Where(a => a.Status == statusEnum);

        return query
            .OrderByDescending(a => a.AppliedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => new CandidateDto
            {
                ApplicationId = a.Id,
                CandidateId = a.Resume != null ? a.Resume.UserId : Guid.Empty,
                CandidateName = a.Resume != null ? a.Resume.User.Name : null,
                Email = a.Resume != null ? a.Resume.User.Email : null,
                Phone = a.Resume != null ? a.Resume.User.Phone : null,
                ResumeUrl = a.Resume != null ? a.Resume.FileUrl : null,
                AppliedAt = a.AppliedAt,
                Status = a.Status != null ? a.Status.Value.ToString() : null,
                MatchScore = a.MatchScore
            })
            .ToListAsync();
    }

    public Task<int> CountCandidatesByJob(Guid jobId, string? status)
    {
        var query = _context.Applications.Where(a => a.JobId == jobId);

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ApplicationStatus>(status, out var statusEnum))
            query = query.Where(a => a.Status == statusEnum);

        return query.CountAsync();
    }
}
