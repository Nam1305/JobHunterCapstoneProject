using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence;

public interface IAdminCompanyRepository
{
    Task<(List<User> Items, int TotalCount)> GetCompanyRegistrationUsers(int page, int limit, bool? status);

    Task<User?> GetCompanyRegistrationUserByCompanyId(Guid companyId);

    Task<bool> ApproveCompanyRegistration(Guid companyId);
}
