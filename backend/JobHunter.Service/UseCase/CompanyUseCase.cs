using System.Text.Json;
using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;
using JobHunter.Service.DTOs.Job;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;

namespace JobHunter.Service.UseCase;

public class CompanyUseCase : ICompanyUseCase
{
    private readonly ICompanyRepository _companyRepository;

    public CompanyUseCase(ICompanyRepository companyRepository)
    {
        _companyRepository = companyRepository;
    }

    public async Task<List<CompanyCardDto>> GetTopCompanies(int limit)
    {
        var results = await _companyRepository.GetTopCompanies(limit);
        return results.Select(r => new CompanyCardDto
        {
            Id = r.Company.Id,
            Name = r.Company.Name,
            Slug = r.Company.Slug,
            LogoUrl = r.Company.LogoUrl,
            CoverPhotoUrl = r.Company.CoverPhotoUrl,
            CompanyType = r.Company.CompanyType,
            TeamSize = r.Company.TeamSize,
            Country = r.Company.Country,
            OpeningVacancies = r.OpeningVacancies,
            NumberOfFollowers = 0
        }).ToList();
    }

    public async Task<PageResult<CompanyCardDto>> GetCompanies(string? search, int page, int pageSize)
    {
        if (page < 1) throw new ArgumentException("Page must be greater than 0");
        if (pageSize < 1) throw new ArgumentException("Page size must be greater than 0");

        var now = DateTimeOffset.UtcNow;
        var (items, totalCount) = await _companyRepository.GetCompanies(search, page, pageSize);

        return new PageResult<CompanyCardDto>
        {
            Items = items.Select(c => new CompanyCardDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                LogoUrl = c.LogoUrl,
                CoverPhotoUrl = c.CoverPhotoUrl,
                CompanyType = c.CompanyType,
                TeamSize = c.TeamSize,
                Country = c.Country,
                OpeningVacancies = c.Jobs.Count(j => j.ExpiredAt == null || j.ExpiredAt > now),
                NumberOfFollowers = 0
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<CompanyDetailsDto> GetCompanyBySlug(string slug)
    {
        if (string.IsNullOrWhiteSpace(slug)) throw new ArgumentException("Slug is required");

        var company = await _companyRepository.GetCompanyBySlug(slug);
        if (company == null) throw new KeyNotFoundException("Company not found");

        return ToCompanyDetails(company);
    }

    private static CompanyDetailsDto ToCompanyDetails(Company company) => new()
    {
        Id = company.Id,
        Name = company.Name,
        WebsiteUrl = company.WebsiteUrl,
        Country = company.Country,
        CompanyType = company.CompanyType,
        LogoUrl = company.LogoUrl,
        CoverPhotoUrl = company.CoverPhotoUrl,
        Overview = company.Overview,
        Benefits = company.Benefits,
        TeamPhotoUrls = ParseTeamPhotoUrls(company),
        TeamSize = company.TeamSize,
        Slug = company.Slug,
        CompanyBranches = company.CompanyBranches.Select(b => new CompanyBranchResponseDto
        {
            Id = b.Id,
            CompanyId = b.CompanyId,
            Name = b.Name,
            Address = b.Address,
            City = b.City,
            CitySlug = b.CitySlug
        }).ToList()
    };

    private static List<string> ParseTeamPhotoUrls(Company company)
    {
        if (company.TeamPhotoUrls == null) return [];

        try
        {
            return company.TeamPhotoUrls.RootElement.EnumerateArray()
                .Select(e => e.GetString() ?? string.Empty)
                .Where(s => !string.IsNullOrEmpty(s))
                .ToList();
        }
        catch (InvalidOperationException)
        {
            return [];
        }
        catch (JsonException)
        {
            return [];
        }
    }
}
