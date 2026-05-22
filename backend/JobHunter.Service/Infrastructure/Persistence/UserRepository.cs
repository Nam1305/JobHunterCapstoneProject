
using JobHunter.Domain.Entities;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobHunter.Service.Infrastructure.Persistence
{
    public class UserRepository : IUserRepository
    {
        private readonly JobhunterContext _context;

        public UserRepository(JobhunterContext context)
        {
            _context = context;
        }

        public Task<User?> GetUserByEmail(string email)
        {
            return _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        }

        public Task<User?> GetUserById(Guid userId)
        {
            return _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        }

        public Task<User?> GetUserByGoogleIdOrEmail(string googleId, string email)
        {
            return _context.Users.FirstOrDefaultAsync(x => x.GoogleId == googleId || x.Email == email);
        }

        public Task<List<User>> GetUsers(string? search, int page, int pageSize)
        {
            return BuildUserQuery(search)
                .OrderByDescending(x => x.CreatedAt)
                .ThenBy(x => x.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public Task<int> CountUsers(string? search)
        {
            return BuildUserQuery(search).CountAsync();
        }

        public async Task<User> AddUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateUser(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        private IQueryable<User> BuildUserQuery(string? search)
        {
            var query = _context.Users
                .AsNoTracking()
                .Where(x => !x.IsDelete);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var keyword = search.Trim();
                query = query.Where(x => EF.Functions.ILike(x.Name, $"%{keyword}%"));
            }

            return query;
        }
    }
}
