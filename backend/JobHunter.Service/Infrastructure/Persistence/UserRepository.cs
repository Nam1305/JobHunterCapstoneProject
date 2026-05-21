
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
    }
}
