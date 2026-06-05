using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;
using JobHunter.Service.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers
{
    [Route("api/hr/company")]
    [ApiController]
    [Authorize(Roles = "HR")]
    public class HRCompanyController : ControllerBase
    {
        private readonly IHrCompanyUseCase _hrCompanyUseCase;

        public HRCompanyController(IHrCompanyUseCase hrCompanyUseCase)
        {
            _hrCompanyUseCase = hrCompanyUseCase;
        }

        [HttpPost("branding/team-images")]
        
        public async Task<ActionResult<ResponseBase<List<string>>>> AddTeamImages([FromForm] List<IFormFile> images)
        {
            // get userId from claim
            var userId = User.GetUserId();
            var brandImageDto = new BrandImageDto
            {
                Images = images,
                UserId = userId
            };
            var newImageUrls = await _hrCompanyUseCase.AddTeamImagesAsync(brandImageDto);
            return new ResponseBase<List<string>>(newImageUrls);

        }
            
        [HttpDelete("branding/team-images")]
        public async Task<ActionResult<ResponseBase<string>>> DeleteTeamImage([FromQuery] string imageUrl)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.DeleteTeamImageAsync(userId, imageUrl);
            return new ResponseBase<string>("Xóa ảnh thành công");
        }

        [HttpGet("branding")]
        public async Task<ActionResult<ResponseBase<BrandingResponseDto>>> GetBranding()
        {
            var userId = User.GetUserId();
            var brandingInfo = await _hrCompanyUseCase.GetBrandingByUserIdAsync(userId);
            brandingInfo.UserId = userId;
            return new ResponseBase<BrandingResponseDto>(brandingInfo);
        }
    }
}
