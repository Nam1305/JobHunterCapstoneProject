
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
            return _context.Users
                .AsNoTracking()
                .Where(x => string.IsNullOrWhiteSpace(search) || EF.Functions.ILike(x.Name, $"%{search.Trim()}%"))
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public Task<int> CountUsers(string? search)
        {
            return _context.Users
                .AsNoTracking()
                .Where(x => string.IsNullOrWhiteSpace(search) || EF.Functions.ILike(x.Name, $"%{search.Trim()}%"))
                .CountAsync();
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

        public async Task<bool> DeleteUser(Guid userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
            {
                return false;
            }

            user.IsDelete = true;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
