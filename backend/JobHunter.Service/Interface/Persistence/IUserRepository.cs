using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmail(string email);

        Task<User?> GetUserById(Guid userId);

        Task<User?> GetUserByGoogleIdOrEmail(string googleId, string email);

        Task<User> AddUser(User user);

        Task UpdateUser(User user);
    }
}
