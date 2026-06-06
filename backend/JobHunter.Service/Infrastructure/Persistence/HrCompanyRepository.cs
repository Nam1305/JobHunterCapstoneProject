using System.Text.Json;
using JobHunter.Domain.Entities;

namespace JobHunter.Service.Infrastructure.Persistence
{
    public class HrCompanyRepository : IHrCompanyRepository
    {
        private readonly JobhunterContext _context;

        public HrCompanyRepository(JobhunterContext context)
        {
            _context = context;
        }

        public async Task AddTeamImagesAsync(Guid companyId, List<string> imageUrls)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
            {
                throw new Exception("Company not found");
            }

            company.TeamPhotoUrls = JsonSerializer.SerializeToDocument(imageUrls);
            await _context.SaveChangesAsync();
        }

        public async Task<Company> GetByIdAsync(Guid companyId)
        {
            return await _context.Companies.FindAsync(companyId);
        }

        public async Task DeleteTeamImagesAsync(Guid companyId, string imageUrl)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
            {
                throw new Exception("Company not found");
            }

            var imageUrls = JsonSerializer.Deserialize<List<string>>(company.TeamPhotoUrls);
            imageUrls?.Remove(imageUrl);
            company.TeamPhotoUrls = JsonSerializer.SerializeToDocument(imageUrls);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateBrandingAsync(Guid companyId, string? overview, string? benefits)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
            {
                throw new Exception("Company not found");
            }

            if (overview != null)
            {
                company.Overview = overview;
            }

            if (benefits != null)
            {
                company.Benefits = benefits;
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateLogoAsync(Guid companyId, string logoUrl)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
            {
                throw new Exception("Company not found");
            }

            company.LogoUrl = logoUrl;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCoverImageAsync(Guid companyId, string coverImageUrl)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
            {
                throw new Exception("Company not found");
            }

            company.CoverPhotoUrl = coverImageUrl;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateGeneralInfoAsync(Guid companyId, string name, string? country, string? websiteUrl, string? companyType, string? TeamSize)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
            {
                throw new Exception("Company not found");
            }

            company.Name = name;
            company.Country = country;
            company.WebsiteUrl = websiteUrl;
            company.CompanyType = companyType;
            company.TeamSize = TeamSize;

            await _context.SaveChangesAsync();
        }
    }
}
