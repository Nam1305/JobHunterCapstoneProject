using JobHunter.Domain.Entities;

public interface IHrCompanyRepository
{
    public Task AddTeamImagesAsync(Guid companyId, List<string> imageUrls);

    public Task DeleteTeamImagesAsync(Guid companyId, string imageUrl);

    public Task<Company> GetByIdAsync(Guid companyId);

    public Task<List<CompanyBranch>> GetBranchesByCompanyIdAsync(Guid companyId);

    public Task<CompanyBranch> AddCompanyBranchAsync(Guid companyId, string name, string address, string city);

    public Task<CompanyBranch> UpdateCompanyBranchAsync(Guid companyId, Guid branchId, string name, string address, string city);

    public Task UpdateBrandingAsync(Guid companyId, string? overview, string? benefits);

    public Task UpdateLogoAsync(Guid companyId, string logoUrl);

    public Task UpdateCoverImageAsync(Guid companyId, string coverImageUrl);

    public Task UpdateGeneralInfoAsync(Guid companyId, string name, string? country, string? websiteUrl, string? companyType, string? TeamSize);

    public Task DeleteBranchAsync(Guid companyId, Guid branchId);

}
