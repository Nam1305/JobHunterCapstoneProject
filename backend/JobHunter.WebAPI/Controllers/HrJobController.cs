using JobHunter.Domain;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Category;
using JobHunter.Service.DTOs.ExperienceLevel;
using JobHunter.Service.DTOs.Job;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/hr/jobs")]
[ApiController]
public class HrJobController : ControllerBase
{
    private readonly IHrJobUseCase _jobUseCase;

    public HrJobController(IHrJobUseCase jobUseCase)
    {
        _jobUseCase = jobUseCase;
    }

    [HttpGet("")]
    [Authorize(Roles = "HR")]
    public async Task<ActionResult<ResponseBase<PageResult<JobPostingDto>>>> GetJobs(
        [FromQuery] string? search,
        [FromQuery] JobStatus? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var userId = User.GetUserId();
        var jobs = await _jobUseCase.GetJobs(userId, search, status, page, pageSize);

        return new ResponseBase<PageResult<JobPostingDto>>(jobs);
    }

    [HttpGet("/api/categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        var categories = await _jobUseCase.GetCategories();

        return categories;
    }

    [HttpGet("/api/experienceLevels")]
    public async Task<ActionResult<ResponseBase<List<ExperienceLevelDto>>>> GetExperienceLevels()
    {
        var levels = await _jobUseCase.GetExperienceLevels();

        return new ResponseBase<List<ExperienceLevelDto>>(levels);
    }

    [HttpPost]
    [Authorize(Roles = "HR")]
    public async Task<ActionResult<ResponseBase<object?>>> CreateJob([FromBody] CreateJobRequestDto request)
    {
        var userId = User.GetUserId();
        var jobId = await _jobUseCase.CreateJob(userId, request);
        var response = new ResponseBase<object?>(null)
        {
            Status = StatusCodes.Status201Created,
            Message = "Tạo tin tuyển dụng thành công"
        };

        return CreatedAtAction(nameof(GetJobDetail), new { uid = jobId }, response);
    }

    [HttpPut("{uid:guid}")]
    [Authorize(Roles = "HR")]
    public async Task<ActionResult<ResponseBase<object?>>> UpdateJob(Guid uid, [FromBody] CreateJobRequestDto request)
    {
        var userId = User.GetUserId();
        await _jobUseCase.UpdateJob(userId, uid, request);

        return new ResponseBase<object?>(null)
        {
            Message = "Cập nhật tin tuyển dụng thành công"
        };
    }

    [HttpPatch("{uid:guid}/close")]
    [Authorize(Roles = "HR")]
    public async Task<ActionResult<ResponseBase<object?>>> CloseJob(Guid uid)
    {
        var userId = User.GetUserId();
        await _jobUseCase.CloseJob(userId, uid);

        return new ResponseBase<object?>(null)
        {
            Message = "Đóng tin tuyển dụng thành công"
        };
    }

    [HttpGet("{uid:guid}")]
    [Authorize(Roles = "HR")]
    public async Task<ActionResult<ResponseBase<JobDetailDto>>> GetJobDetail(Guid uid)
    {
        var job = await _jobUseCase.GetJobDetailsById(uid);

        return new ResponseBase<JobDetailDto>(job);
    }
}
