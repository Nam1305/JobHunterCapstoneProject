using System.Text.Json;
using JobHunter.Domain.Entities;
using Microsoft.EntityFrameworkCore;

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

        public Task<List<CompanyBranch>> GetBranchesByCompanyIdAsync(Guid companyId)
        {
            return _context.CompanyBranches
                .AsNoTracking()
                .Where(branch => branch.CompanyId == companyId)
                .OrderBy(branch => branch.Name)
                .ToListAsync();
        }

        public async Task AddCompanyBranchAsync(Guid companyId, string name, string address, string city)
        {
            var companyExists = await _context.Companies.AnyAsync(company => company.Id == companyId);
            if (!companyExists)
            {
                throw new Exception("Company not found");
            }

            var branch = new CompanyBranch
            {
                Id = Guid.NewGuid(),
                CompanyId = companyId,
                Name = name,
                Address = address,
                City = city,
                CitySlug = string.IsNullOrWhiteSpace(city) ? null : JobHunter.Service.Utils.SlugGenerator.GenerateSlug(city)
            };

            _context.CompanyBranches.Add(branch);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCompanyBranchAsync(Guid companyId, Guid branchId, string name, string address, string city)
        {
            var updatedRows = await _context.CompanyBranches
                .Where(branch => branch.Id == branchId && branch.CompanyId == companyId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(branch => branch.Name, name)
                    .SetProperty(branch => branch.Address, address)
                    .SetProperty(branch => branch.City, city)
                    .SetProperty(
                        branch => branch.CitySlug,
                        string.IsNullOrWhiteSpace(city) ? null : JobHunter.Service.Utils.SlugGenerator.GenerateSlug(city)));

            if (updatedRows == 0)
            {
                throw new Exception("Branch not found");
            }
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
            var updatedRows = await _context.Companies
                .Where(company => company.Id == companyId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(company => company.Overview, company => overview ?? company.Overview)
                    .SetProperty(company => company.Benefits, company => benefits ?? company.Benefits));

            if (updatedRows == 0)
            {
                throw new Exception("Company not found");
            }
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

        public async Task UpdateGeneralInfoAsync(Guid companyId, string? name, string? country, string? websiteUrl, string? companyType, string? TeamSize)
        {
            var updatedRows = await _context.Companies
                .Where(company => company.Id == companyId)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(company => company.Name, name)
                    .SetProperty(company => company.Country, country)
                    .SetProperty(company => company.WebsiteUrl, websiteUrl)
                    .SetProperty(company => company.CompanyType, companyType)
                    .SetProperty(company => company.TeamSize, TeamSize));

            if (updatedRows == 0)
            {
                throw new Exception("Company not found");
            }
        }
        public async Task DeleteBranchAsync(Guid companyId, Guid branchId)
        {
            var hasJobs = await _context.Jobs
                .AnyAsync(job => job.CompanyId == companyId && job.BranchId == branchId);
            if (hasJobs)
            {
                throw new InvalidOperationException("Cannot delete branch because it has jobs");
            }

            var deletedRows = await _context.CompanyBranches
                .Where(branch => branch.Id == branchId && branch.CompanyId == companyId)
                .ExecuteDeleteAsync();

            if (deletedRows == 0)
            {
                throw new KeyNotFoundException("Branch not found");
            }
        }    }
}
