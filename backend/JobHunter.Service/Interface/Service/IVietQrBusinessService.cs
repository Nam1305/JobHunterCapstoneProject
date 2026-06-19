using JobHunter.Service.DTOs.Company;

namespace JobHunter.Service.Interface.Service;

public interface IVietQrBusinessService
{
    Task<CompanyTaxCodeInfoDto> GetBusinessByTaxCode(string taxCode);
}
