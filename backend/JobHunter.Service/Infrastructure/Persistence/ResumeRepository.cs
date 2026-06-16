using JobHunter.Domain.Entities;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence;

public class ResumeRepository : IResumeRepository
{
    private readonly JobhunterContext _context;

    public ResumeRepository(JobhunterContext context)
    {
        _context = context;
    }

    public Task<List<Resume>> GetResumesByUserId(Guid userId)
    {
        return _context.Resumes
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public Task<Resume?> GetResumeById(Guid resumeId)
    {
        return _context.Resumes.FirstOrDefaultAsync(r => r.Id == resumeId);
    }

    public async Task<Resume> AddResume(Resume resume)
    {
        await _context.Resumes.AddAsync(resume);
        await _context.SaveChangesAsync();
        return resume;
    }

    public async Task UpdateResume(Resume resume)
    {
        _context.Resumes.Update(resume);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteResume(Resume resume)
    {
        _context.Resumes.Remove(resume);
        await _context.SaveChangesAsync();
    }
}
