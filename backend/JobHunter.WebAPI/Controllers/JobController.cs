using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Job;
using JobHunter.Service.Interface.UseCase;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/jobs")]
[ApiController]
public class JobController : ControllerBase
{
    private readonly IJobUseCase _jobUseCase;

    public JobController(IJobUseCase jobUseCase)
    {
        _jobUseCase = jobUseCase;
    }

    [HttpGet("top")]
    public async Task<ActionResult<ResponseBase<List<JobCardDto>>>> GetTopJobs(
        [FromQuery] int limit = 9)
    {
        var jobs = await _jobUseCase.GetTopJobs(limit);
        return new ResponseBase<List<JobCardDto>>(jobs);
    }

    [HttpGet("filter-options")]
    public async Task<ActionResult<ResponseBase<JobFilterOptionsDto>>> GetFilterOptions()
    {
        var options = await _jobUseCase.GetFilterOptions();
        return new ResponseBase<JobFilterOptionsDto>(options);
    }

    [HttpGet]
    public async Task<ActionResult<ResponseBase<PageResult<JobDetailsDto>>>> GetJobs(
        [FromQuery] string? search,
        [FromQuery] string? location,
        [FromQuery] string? companySlug,
        [FromQuery] List<string> categorySlugs,
        [FromQuery] List<string> subcategorySlugs,
        [FromQuery] List<string> levelSlugs,
        [FromQuery] List<string> workTypes,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
    {
        var result = await _jobUseCase.GetJobs(
            search, location, companySlug,
            categorySlugs, subcategorySlugs, levelSlugs, workTypes,
            page, pageSize);
        return new ResponseBase<PageResult<JobDetailsDto>>(result);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ResponseBase<JobDetailsDto>>> GetJobBySlug(string slug)
    {
        var job = await _jobUseCase.GetJobBySlug(slug);
        return new ResponseBase<JobDetailsDto>(job);
    }
}
