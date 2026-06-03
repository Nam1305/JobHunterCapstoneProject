using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence;

public interface ICompanyRepository
{
    Task<List<(Company Company, int OpeningVacancies)>> GetTopCompanies(int limit);
    Task<(List<Company> Items, int TotalCount)> GetCompanies(string? search, int page, int pageSize);
}
