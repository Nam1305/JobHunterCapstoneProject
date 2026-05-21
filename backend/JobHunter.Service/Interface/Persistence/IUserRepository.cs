namespace JobHunter.Service.Interface.Persistence
{
    public interface IUserRepository
    {
        Task<JobHunter.Service.Infrastructure.Persistence.User?> GetUserByEmail(string email);

        Task<JobHunter.Service.Infrastructure.Persistence.User?> GetUserById(Guid userId);

        Task<JobHunter.Service.Infrastructure.Persistence.User?> GetUserByGoogleIdOrEmail(string googleId, string email);

        Task<JobHunter.Service.Infrastructure.Persistence.User> AddUser(JobHunter.Service.Infrastructure.Persistence.User user);

        Task UpdateUser(JobHunter.Service.Infrastructure.Persistence.User user);
    }
}
