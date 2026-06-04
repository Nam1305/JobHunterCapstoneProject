using Microsoft.AspNetCore.Http;

namespace JobHunter.Service.DTOs.Company
{
    public class BrandImageDto
    {
       public Guid UserId { get; set; }

        public List<IFormFile> Images { get; set; } = new();

    }
}
