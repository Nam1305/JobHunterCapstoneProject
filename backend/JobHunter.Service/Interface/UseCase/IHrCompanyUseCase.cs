using JobHunter.Service.DTOs.Company;

public interface IHrCompanyUseCase
{
    public Task<List<string>> AddTeamImagesAsync(BrandImageDto brandImageDto);

    public Task<BrandingResponseDto> GetBrandingByUserIdAsync(Guid userId);

    public Task DeleteTeamImageAsync(Guid userId, string imageUrl);
}