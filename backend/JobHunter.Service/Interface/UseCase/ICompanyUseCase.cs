using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;

namespace JobHunter.Service.Interface.UseCase;

public interface ICompanyUseCase
{
    Task<List<CompanyCardDto>> GetTopCompanies(int limit);
    Task<PageResult<CompanyCardDto>> GetCompanies(string? search, int page, int pageSize);
}
