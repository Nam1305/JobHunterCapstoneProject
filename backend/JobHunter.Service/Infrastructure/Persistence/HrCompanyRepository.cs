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
    }
}
