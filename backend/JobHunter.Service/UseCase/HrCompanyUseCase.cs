using System.Text.Json;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.Service;
using Microsoft.AspNetCore.Http;

public class HrCompanyUseCase : IHrCompanyUseCase
{
    private readonly IHrCompanyRepository _hrCompanyRepository;

    private readonly IUserRepository _userRepository;

    private readonly IFileService _fileService;

    public HrCompanyUseCase(IHrCompanyRepository hrCompanyRepository, IUserRepository userRepository, IFileService fileService)
    {
        _hrCompanyRepository = hrCompanyRepository;
        _userRepository = userRepository;
        _fileService = fileService;
    }


    public async Task<List<string>> AddTeamImagesAsync(Guid userId, List<IFormFile> images)
    {
        if (images == null || !images.Any())
            throw new ArgumentException("Không có ảnh nào được gửi lên.", nameof(images));

        if (images.Count > 5)
            throw new ArgumentException("Chỉ được upload tối đa 5 ảnh cùng lúc.", nameof(images));

        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        var newUploadedUrls = await _fileService.UploadMultipleFilesAsync(images);
        
        if (!newUploadedUrls.Any())
            throw new InvalidOperationException("Upload ảnh thất bại.");

        List<string> currentUrls = new List<string>();

        if (company.TeamPhotoUrls != null)
        {
            // Dịch ngược JsonDocument cũ trong DB ra thành List<string>
            currentUrls = JsonSerializer.Deserialize<List<string>>(company.TeamPhotoUrls) ?? new List<string>();
        }

        // Nối các link S3 mới vừa up vào danh sách cũ
        currentUrls.AddRange(newUploadedUrls);

        // Đóng gói List đó ngược lại thành JsonDocument mới và gán lại cho Entity
        company.TeamPhotoUrls = JsonSerializer.SerializeToDocument(currentUrls);

        // 5. Cập nhật vào DB
        await _hrCompanyRepository.AddTeamImagesAsync(company.Id, currentUrls);

        return newUploadedUrls;
    
    }

    public async Task DeleteTeamImageAsync(Guid userId, string imageUrl)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        await _hrCompanyRepository.DeleteTeamImagesAsync(user.CompanyId.Value, imageUrl);
        await _fileService.DeleteFileAsync(imageUrl);
    }

    public async Task<BrandingResponseDto> GetBrandingByUserIdAsync(Guid userId)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        var brandingResponse = new BrandingResponseDto
        {
            Overview = company.Overview,
            Benefits = company.Benefits,
            TeamPhotoUrls = company.TeamPhotoUrls != null
                ? JsonSerializer.Deserialize<List<string>>(company.TeamPhotoUrls)
                : new List<string>()
        };

        return brandingResponse;
    }

    public async Task<GeneralResponseDto> GetGeneralInfoAsync(Guid userId)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        return new GeneralResponseDto
        {
            Name = company.Name,
            TeamSize = company.TeamSize,
            WebsiteUrl = company.WebsiteUrl,
            Country = company.Country,
            CompanyType = company.CompanyType,
            CoverUrl = company.CoverPhotoUrl,
            LogoUrl = company.LogoUrl
        };
    }

    public async Task<List<BranchDto>> GetBranchesByUserIdAsync(Guid userId)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        var branches = await _hrCompanyRepository.GetBranchesByCompanyIdAsync(company.Id);
        if (branches.Count == 0)
        {
            throw new KeyNotFoundException("Branches not found");
        }

        return branches.Select(branch => new BranchDto
        {
            Id = branch.Id,
            Name = branch.Name ?? string.Empty
        }).ToList();
    }

    public async Task<BrandingResponseDto> UpdateBrandingAsync(Guid userId, EditBrandingDto request)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        company.Overview = request.Overview;
        company.Benefits = request.Benefits;

        await _hrCompanyRepository.UpdateBrandingAsync(company.Id, company.Overview, company.Benefits);

        var brandingResponse = new BrandingResponseDto
        {
            Overview = company.Overview,
            Benefits = company.Benefits,
            TeamPhotoUrls = company.TeamPhotoUrls != null
                ? JsonSerializer.Deserialize<List<string>>(company.TeamPhotoUrls)
                : new List<string>()
        };

        return brandingResponse;
    }

    public async Task UpdateCoverImageAsync(Guid userId, IFormFile coverImageFile)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        var newCoverImageUrl = await _fileService.UploadFileAsync(coverImageFile);
        if (string.IsNullOrEmpty(newCoverImageUrl))
            throw new InvalidOperationException("Upload ảnh thất bại.");
        
        if (!string.IsNullOrEmpty(company.CoverPhotoUrl))
        {
            await _fileService.DeleteFileAsync(company.CoverPhotoUrl);
        }

        company.CoverPhotoUrl = newCoverImageUrl;
        await _hrCompanyRepository.UpdateCoverImageAsync(company.Id, company.CoverPhotoUrl);
        return;
    }

    public async Task UpdateGeneralInfoAsync(Guid userId, EditGeneralDto request)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        company.Name = request.Name;
        company.Country = request.Country;
        company.WebsiteUrl = request.WebsiteUrl;
        company.CompanyType = request.CompanyType;
        company.TeamSize = request.TeamSize;

        await _hrCompanyRepository.UpdateGeneralInfoAsync(company.Id, company.Name, company.Country, company.WebsiteUrl, company.CompanyType, company.TeamSize);
        return;
    }

    public async Task UpdateLogoAsync(Guid userId, IFormFile logoFile)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        var newLogoUrl = await _fileService.UploadFileAsync(logoFile);
        if (string.IsNullOrEmpty(newLogoUrl))
            throw new InvalidOperationException("Upload logo failed.");

        if (!string.IsNullOrEmpty(company.LogoUrl))
        {
            await _fileService.DeleteFileAsync(company.LogoUrl);
        }

        company.LogoUrl = newLogoUrl;
        await _hrCompanyRepository.UpdateLogoAsync(company.Id, company.LogoUrl);
    }
}
