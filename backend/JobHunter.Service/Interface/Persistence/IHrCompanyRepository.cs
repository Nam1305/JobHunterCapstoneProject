using JobHunter.Domain.Entities;

public interface IHrCompanyRepository
{
    public Task AddTeamImagesAsync(Guid companyId, List<string> imageUrls);

    public Task DeleteTeamImagesAsync(Guid companyId, string imageUrl);

    public Task<Company> GetByIdAsync(Guid companyId);
}