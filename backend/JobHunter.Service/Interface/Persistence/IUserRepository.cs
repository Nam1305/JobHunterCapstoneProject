namespace JobHunter.Service.Interface.Persistence
{
    public interface IUserRepository
    {
        Task<JobHunter.Service.Infrastructure.Persistence.User?> GetUserByEmail(string email);

        Task<JobHunter.Service.Infrastructure.Persistence.User?> GetUserById(Guid userId);
    }
}
