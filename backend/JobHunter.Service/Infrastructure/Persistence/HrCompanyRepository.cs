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
                .Where(branch => branch.CompanyId == companyId && !branch.IsDelete)
                .OrderBy(branch => branch.Name)
                .ToListAsync();
        }

        public async Task<CompanyBranch> AddCompanyBranchAsync(Guid companyId, string name, string address, string city)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
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

            return branch;
        }

        public async Task<CompanyBranch> UpdateCompanyBranchAsync(Guid companyId, Guid branchId, string name, string address, string city)
        {
            var branch = await _context.CompanyBranches
                .FirstOrDefaultAsync(b => b.Id == branchId && b.CompanyId == companyId && !b.IsDelete);

            if (branch == null)
            {
                throw new Exception("Branch not found");
            }

            branch.Name = name;
            branch.Address = address;
            branch.City = city;
            branch.CitySlug = string.IsNullOrWhiteSpace(city) ? null : JobHunter.Service.Utils.SlugGenerator.GenerateSlug(city);

            await _context.SaveChangesAsync();
            return branch;
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
        public async Task DeleteBranchAsync(Guid companyId, Guid branchId)
        {
            var branch = await _context.CompanyBranches
                .FirstOrDefaultAsync(b => b.Id == branchId && b.CompanyId == companyId && !b.IsDelete);

            if (branch == null)
            {
                throw new Exception("Branch not found");
            }

            branch.IsDelete = true;
            await _context.SaveChangesAsync();
        }    }
}
