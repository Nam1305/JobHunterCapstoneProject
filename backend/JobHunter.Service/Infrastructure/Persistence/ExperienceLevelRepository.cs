using JobHunter.Domain.Entities;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence;

public class ExperienceLevelRepository : IExperienceLevelRepository
{
    private readonly JobhunterContext _context;

    public ExperienceLevelRepository(JobhunterContext context)
    {
        _context = context;
    }

    public Task<List<JobLevel>> GetExperienceLevels()
    {
        return _context.JobLevels
            .AsNoTracking()
            .OrderBy(level => level.Title)
            .ToListAsync();
    }
}
