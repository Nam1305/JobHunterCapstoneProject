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
    }
}
