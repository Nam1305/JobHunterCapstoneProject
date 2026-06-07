using JobHunter.Domain.Entities;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence;

public class CategoryRepository : ICategoryRepository
{
    private readonly JobhunterContext _context;

    public CategoryRepository(JobhunterContext context)
    {
        _context = context;
    }

    public Task<List<JobCategory>> GetCategoriesWithSubcategories()
    {
        return _context.JobCategories
            .AsNoTracking()
            .Include(category => category.JobSubcategories)
            .OrderBy(category => category.Name)
            .ToListAsync();
    }
}
