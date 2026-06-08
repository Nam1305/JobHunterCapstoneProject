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
            var newImageUrls = await _hrCompanyUseCase.AddTeamImagesAsync(userId, images);
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
            return new ResponseBase<BrandingResponseDto>(brandingInfo);
        }

        // update overview and benefits
        [HttpPut("branding")]
        public async Task<ActionResult<ResponseBase<BrandingResponseDto>>> UpdateBranding([FromBody] EditBrandingDto request)
        {
            var userId = User.GetUserId();
            var updatedBranding = await _hrCompanyUseCase.UpdateBrandingAsync(userId, request);
            return new ResponseBase<BrandingResponseDto>(updatedBranding);
        }

        [HttpPut("logo")]
        public async Task<ActionResult<ResponseBase<string>>> UpdateLogo(IFormFile logoFile)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.UpdateLogoAsync(userId, logoFile);
            return new ResponseBase<string>("Cập nhật logo thành công");
        }

        // update cover image
        [HttpPut("cover-image")]
        public async Task<ActionResult<ResponseBase<string>>> UpdateCoverImage(IFormFile coverImageFile)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.UpdateCoverImageAsync(userId, coverImageFile);
            return new ResponseBase<string>("Cập nhật ảnh bìa thành công");
        }

        // update General
        [HttpPut("general")]
        public async Task<ActionResult<ResponseBase<string>>> UpdateGeneralInfo([FromBody] EditGeneralDto request)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.UpdateGeneralInfoAsync(userId, request);
            return new ResponseBase<string>("Cập nhật thông tin chung thành công");
        }

        // get General
        [HttpGet("general")]
        public async Task<ActionResult<ResponseBase<GeneralResponseDto>>> GetGeneralInfo()
        {
            var userId = User.GetUserId();
            var generalInfo = await _hrCompanyUseCase.GetGeneralInfoAsync(userId);
            return new ResponseBase<GeneralResponseDto>(generalInfo);
        }

        [HttpGet("branch/getbyUid")]
        public async Task<ActionResult<ResponseBase<List<BranchDto>>>> GetBranchesByUserId()
        {
            var userId = User.GetUserId();
            var branches = await _hrCompanyUseCase.GetBranchesByUserIdAsync(userId);

            return new ResponseBase<List<BranchDto>>(branches);
        }

        [HttpGet("branches")]
        public async Task<ActionResult<ResponseBase<List<BranchDetailsDto>>>> GetBranches()
        {
            var userId = User.GetUserId();
            var branches = await _hrCompanyUseCase.GetCompanyBranchesByUserIdAsync(userId);

            return new ResponseBase<List<BranchDetailsDto>>(branches);
        }
    }
}
