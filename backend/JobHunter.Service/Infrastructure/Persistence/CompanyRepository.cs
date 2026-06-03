using JobHunter.Domain.Entities;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence;

public class CompanyRepository : ICompanyRepository
{
    private readonly JobhunterContext _context;

    public CompanyRepository(JobhunterContext context)
    {
        _context = context;
    }

    public async Task<List<(Company Company, int OpeningVacancies)>> GetTopCompanies(int limit)
    {
        var now = DateTimeOffset.UtcNow;

        return await _context.Companies
            .AsNoTracking()
            .Select(c => new
            {
                Company = c,
                OpeningVacancies = c.Jobs.Count(j => j.ExpiredAt == null || j.ExpiredAt > now)
            })
            .OrderByDescending(x => x.OpeningVacancies)
            .Take(limit)
            .Select(x => ValueTuple.Create(x.Company, x.OpeningVacancies))
            .ToListAsync();
    }

    public async Task<(List<Company> Items, int TotalCount)> GetCompanies(string? search, int page, int pageSize)
    {
        var query = _context.Companies
            .AsNoTracking()
            .Where(c => string.IsNullOrWhiteSpace(search) || EF.Functions.ILike(c.Name, $"%{search.Trim()}%"));

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(c => c.Jobs)
            .ToListAsync();

        return (items, totalCount);
    }
}
