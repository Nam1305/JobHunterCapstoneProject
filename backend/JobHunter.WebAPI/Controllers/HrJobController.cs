using JobHunter.Domain;
using JobHunter.Service.DTOs;
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

    [HttpPost]
    [Authorize(Roles = "HR")]
    public async Task<ActionResult<ResponseBase<JobDetailDto>>> CreateJob([FromBody] CreateJobRequestDto request)
    {
        var userId = User.GetUserId();
        var job = await _jobUseCase.CreateJob(userId, request);
        var response = new ResponseBase<JobDetailDto>(job)
        {
            Status = StatusCodes.Status201Created
        };

        return CreatedAtAction(nameof(GetJobDetail), new { uid = job.Id }, response);
    }

    [HttpPut("{uid:guid}")]
    [Authorize(Roles = "HR")]
    public async Task<ActionResult<ResponseBase<JobDetailDto>>> UpdateJob(Guid uid, [FromBody] CreateJobRequestDto request)
    {
        var userId = User.GetUserId();
        var job = await _jobUseCase.UpdateJob(userId, uid, request);

        return new ResponseBase<JobDetailDto>(job);
    }

    [HttpGet("{uid:guid}")]
    [Authorize(Roles = "HR")]
    public async Task<ActionResult<ResponseBase<JobDetailDto>>> GetJobDetail(Guid uid)
    {
        var job = await _jobUseCase.GetJobDetailsById(uid);

        return new ResponseBase<JobDetailDto>(job);
    }
}
