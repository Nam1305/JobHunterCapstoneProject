using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;

namespace JobHunter.Service.Interface.UseCase;

public interface IAdminCompanyUseCase
{
    Task<PageResult<CompanyRegistrationDto>> GetCompanyRegistrations(int page, int limit, string? status);

    Task<CompanyRegistrationDetailDto> GetCompanyRegistration(Guid uid);

    Task ApproveCompanyRegistration(Guid uid);

    Task<CompanyTaxCodeInfoDto> CheckTaxCode(string taxCode);
}
