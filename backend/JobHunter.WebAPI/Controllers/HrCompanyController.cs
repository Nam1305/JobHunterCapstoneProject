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
        
        public async Task<ActionResult<ResponseBase<object?>>> AddTeamImages([FromForm] List<IFormFile> images)
        {
            // get userId from claim
            var userId = User.GetUserId();
            await _hrCompanyUseCase.AddTeamImagesAsync(userId, images);
            return new ResponseBase<object?>(null)
            {
                Message = "Tải ảnh đội ngũ thành công"
            };

        }
            
        [HttpDelete("branding/team-images")]
        public async Task<ActionResult<ResponseBase<object?>>> DeleteTeamImage([FromQuery] string imageUrl)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.DeleteTeamImageAsync(userId, imageUrl);
            return new ResponseBase<object?>(null)
            {
                Message = "Xóa ảnh thành công"
            };
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
        public async Task<ActionResult<ResponseBase<object?>>> UpdateBranding([FromBody] EditBrandingDto request)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.UpdateBrandingAsync(userId, request);
            return new ResponseBase<object?>(null)
            {
                Message = "Cập nhật thông tin thương hiệu thành công"
            };
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
        public async Task<ActionResult<ResponseBase<object?>>> UpdateGeneralInfo([FromBody] EditGeneralDto request)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.UpdateGeneralInfoAsync(userId, request);
            return new ResponseBase<object?>(null)
            {
                Message = "Cập nhật thông tin chung thành công"
            };
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

        [HttpPost("branch")]
        public async Task<ActionResult<ResponseBase<object?>>> CreateBranch([FromBody] CreateBranchRequestDto request)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.CreateBranchAsync(userId, request);
            return new ResponseBase<object?>(null)
            {
                Message = "Tạo chi nhánh thành công"
            };
        }

        [HttpPut("branch/{id}")]
        public async Task<ActionResult<ResponseBase<object?>>> UpdateBranch(Guid id, [FromBody] CreateBranchRequestDto request)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.UpdateBranchAsync(userId, id, request);
            return new ResponseBase<object?>(null)
            {
                Message = "Cập nhật chi nhánh thành công"
            };
        }

        [HttpDelete("branch/{id}")]
        public async Task<ActionResult<ResponseBase<object?>>> DeleteBranch(Guid id)
        {
            var userId = User.GetUserId();
            await _hrCompanyUseCase.DeleteBranchAsync(userId, id);
            return new ResponseBase<object?>(null)
            {
                Message = "Xóa chi nhánh thành công"
            };
        }
    }
}
