using JobHunter.Service.DTOs.Company;

public interface IHrCompanyUseCase
{
    public Task<List<string>> AddTeamImagesAsync(BrandImageDto brandImageDto);

    public Task DeleteTeamImageAsync(Guid userId, string imageUrl);
}