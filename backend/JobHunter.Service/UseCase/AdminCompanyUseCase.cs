using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;

namespace JobHunter.Service.UseCase;

public class AdminCompanyUseCase : IAdminCompanyUseCase
{
    private readonly IAdminCompanyRepository _adminCompanyRepository;

    public AdminCompanyUseCase(IAdminCompanyRepository adminCompanyRepository)
    {
        _adminCompanyRepository = adminCompanyRepository;
    }

    public async Task<PageResult<CompanyRegistrationDto>> GetCompanyRegistrations(int page, int limit, string? status)
    {
        if (page < 1) throw new ArgumentException("Page must be greater than 0");
        if (limit < 1) throw new ArgumentException("Limit must be greater than 0");

        var statusFilter = ParseCompanyRegistrationStatus(status);
        var (items, totalCount) = await _adminCompanyRepository.GetCompanyRegistrationUsers(page, limit, statusFilter);

        return new PageResult<CompanyRegistrationDto>
        {
            Page = page,
            PageSize = limit,
            TotalCount = totalCount,
            Items = items.Select(user => new CompanyRegistrationDto
            {
                Id = user.Company!.Id,
                HrName = user.Name,
                Phone = user.Phone,
                Email = user.Email,
                CompanyName = user.Company.Name,
                WebsiteUrl = user.Company.WebsiteUrl,
                Status = user.Company.Status ? "approved" : "pending",
                CreateAt = user.Company.CreatedAt
            }).ToList()
        };
    }

    public async Task<CompanyRegistrationDetailDto> GetCompanyRegistration(Guid uid)
    {
        var user = await _adminCompanyRepository.GetCompanyRegistrationUserByCompanyId(uid);
        if (user == null)
        {
            throw new KeyNotFoundException("Company registration not found");
        }

        var company = user.Company!;

        return new CompanyRegistrationDetailDto
        {
            Id = company.Id,
            HrName = user.Name,
            Phone = user.Phone,
            Email = user.Email,
            CompanyName = company.Name,
            WebsiteUrl = company.WebsiteUrl,
            TaxCode = company.TaxCode,
            Status = company.Status ? "approved" : "pending",
            Country = company.Country,
            CompanyType = company.CompanyType,
            TeamSize = company.TeamSize,
            Overview = company.Overview,
            CreateAt = company.CreatedAt
        };
    }

    public async Task ApproveCompanyRegistration(Guid uid)
    {
        var approved = await _adminCompanyRepository.ApproveCompanyRegistration(uid);
        if (!approved)
        {
            throw new KeyNotFoundException("Company registration not found");
        }
    }

    private static bool? ParseCompanyRegistrationStatus(string? status)
    {
        if (string.IsNullOrWhiteSpace(status))
        {
            return null;
        }

        return status.Trim().ToLowerInvariant() switch
        {
            "pending" => false,
            "approved" => true,
            _ => throw new ArgumentException("Status must be pending or approved")
        };
    }
}
