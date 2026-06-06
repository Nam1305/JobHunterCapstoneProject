using JobHunter.Service.DTOs.Company;
using Microsoft.AspNetCore.Http;

public interface IHrCompanyUseCase
{
    public Task<List<string>> AddTeamImagesAsync(Guid userId, List<IFormFile> images);

    public Task<BrandingResponseDto> GetBrandingByUserIdAsync(Guid userId);

    public Task DeleteTeamImageAsync(Guid userId, string imageUrl);

    public Task<BrandingResponseDto> UpdateBrandingAsync(Guid userId, EditBrandingDto request);

    public Task UpdateLogoAsync(Guid userId, IFormFile logoFile);

    public Task UpdateCoverImageAsync(Guid userId, IFormFile coverImageFile);

    public Task UpdateGeneralInfoAsync(Guid userId, EditGeneralDto request);

    public Task<GeneralResponseDto> GetGeneralInfoAsync(Guid userId);
}