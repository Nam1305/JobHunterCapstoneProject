using JobHunter.Domain;
using JobHunter.Domain.Entities;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence;

public class AdminCompanyRepository : IAdminCompanyRepository
{
    private readonly JobhunterContext _context;

    public AdminCompanyRepository(JobhunterContext context)
    {
        _context = context;
    }

    public async Task<(List<User> Items, int TotalCount)> GetCompanyRegistrationUsers(int page, int limit, bool? status)
    {
        var query = _context.Users
            .AsNoTracking()
            .Include(user => user.Company)
            .Where(user => user.Role == UserRole.HR && user.CompanyId != null && user.Company != null);

        if (status.HasValue)
        {
            query = query.Where(user => user.Company!.Status == status.Value);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(user => user.Company!.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return (items, totalCount);
    }

    public Task<User?> GetCompanyRegistrationUserByCompanyId(Guid companyId)
    {
        return _context.Users
            .AsNoTracking()
            .Include(user => user.Company)
            .FirstOrDefaultAsync(user =>
                user.Role == UserRole.HR &&
                user.CompanyId == companyId &&
                user.Company != null);
    }
}
