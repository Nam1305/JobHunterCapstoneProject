using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.HR;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/hr")]
[ApiController]
// [Authorize(Roles = "HR")]
public class HRController : ControllerBase
{
    private readonly IHRDashboardUseCase _hrDashboardUseCase;

    public HRController(IHRDashboardUseCase hrDashboardUseCase)
    {
        _hrDashboardUseCase = hrDashboardUseCase;
    }

    [HttpGet("jobs")]
    public async Task<ActionResult<ResponseBase<PageResult<JobItemDto>>>> GetJobs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? search = null,
        [FromQuery] string? status = null)
    {
        var userId = User.GetUserId();
        var result = await _hrDashboardUseCase.GetJobs(userId, search, status, page, pageSize);
        return new ResponseBase<PageResult<JobItemDto>>(result);
    }

    [HttpGet("jobs/{jobId:guid}/candidates")]
    public async Task<ActionResult<ResponseBase<PageResult<CandidateDto>>>> GetCandidates(
        Guid jobId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null)
    {
        var userId = User.GetUserId();
        var result = await _hrDashboardUseCase.GetCandidates(userId, jobId, status, page, pageSize);
        return new ResponseBase<PageResult<CandidateDto>>(result);
    }
}
