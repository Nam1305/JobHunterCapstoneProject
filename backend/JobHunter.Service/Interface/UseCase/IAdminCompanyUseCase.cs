using JobHunter.Service.DTOs.Company;

namespace JobHunter.Service.Interface.UseCase;

public interface IAdminCompanyUseCase
{
    Task<CompanyRegistrationPageDto> GetCompanyRegistrations(int page, int limit, string? status);
}
