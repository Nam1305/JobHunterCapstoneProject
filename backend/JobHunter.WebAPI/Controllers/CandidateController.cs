using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Candidate;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/candidate")]
[ApiController]
[Authorize(Roles = "Candidate")]
public class CandidateController : ControllerBase
{
    private readonly ICandidateResumeUseCase _candidateResumeUseCase;
    private readonly IFollowingUseCase _followingUseCase;

    public CandidateController(
        ICandidateResumeUseCase candidateResumeUseCase,
        IFollowingUseCase followingUseCase)
    {
        _candidateResumeUseCase = candidateResumeUseCase;
        _followingUseCase = followingUseCase;
    }

    //get all resumes of current candidate
    [HttpGet("resumes")]
    public async Task<ActionResult<ResponseBase<List<ResumeDto>>>> GetResumes()
    {
        var userId = User.GetUserId();
        var result = await _candidateResumeUseCase.GetResumes(userId);
        return new ResponseBase<List<ResumeDto>>(result);
    }

    //upload CV
    [HttpPost("resumes")]
    public async Task<ActionResult<ResponseBase<ResumeDto>>> UploadResume(IFormFile file)
    {
        var userId = User.GetUserId();
        var result = await _candidateResumeUseCase.UploadResume(userId, file);
        return new ResponseBase<ResumeDto>(result);
    }

    //toogle status finding job or not
    [HttpPatch("resumes/{resumeId:guid}/status")]
    public async Task<ActionResult<ResponseBase<ResumeDto>>> ToggleStatus(
        Guid resumeId,
        [FromBody] UpdateResumeStatusRequestDto request)
    {
        var userId = User.GetUserId();
        var result = await _candidateResumeUseCase.ToggleLookingForJobStatus(userId, resumeId, request.IsLookingForJob);
        return new ResponseBase<ResumeDto>(result);
    }

    //delete Resume
    [HttpDelete("resumes/{resumeId:guid}")]
    public async Task<ActionResult<ResponseBase<object>>> DeleteResume(Guid resumeId)
    {
        var userId = User.GetUserId();
        await _candidateResumeUseCase.DeleteResume(userId, resumeId);
        return new ResponseBase<object>(null);
    }
    
    [HttpPost("applications")]
    public async Task<ActionResult<ResponseBase<ApplicationResultDto>>> ApplyJob(
        [FromBody] ApplyJobRequestDto request)
    {
        var userId = User.GetUserId();
        var result = await _candidateResumeUseCase.ApplyJob(userId, request);
        return new ResponseBase<ApplicationResultDto>(result);
    }

    //Check status job application, apply or not ?
    [HttpGet("applications/{jobId:guid}/status")]
    public async Task<ActionResult<ResponseBase<JobApplicationStatusDto>>> GetApplicationStatus(Guid jobId)
    {
        var userId = User.GetUserId();
        var result = await _candidateResumeUseCase.GetApplicationStatus(userId, jobId);
        return new ResponseBase<JobApplicationStatusDto>(result);
    }

    [HttpPost("following/jobs/{jobId:guid}")]
    public async Task<ActionResult<ResponseBase<object>>> FollowJob(Guid jobId)
    {
        var userId = User.GetUserId();
        await _followingUseCase.FollowJob(userId, jobId);
        return new ResponseBase<object>("Followed job successfully.");
    }

    [HttpGet("following/jobs/liked-status")]
    public async Task<ActionResult<ResponseBase<FollowingJobsLikedStatusDto>>> GetLikedJobStatus(
        [FromQuery] List<Guid> jobIds)
    {
        var userId = User.GetUserId();
        var result = await _followingUseCase.GetLikedJobStatus(userId, jobIds);
        return new ResponseBase<FollowingJobsLikedStatusDto>(result);
    }

    [HttpPost("following/companies/{companyId:guid}")]
    public async Task<ActionResult<ResponseBase<object>>> FollowCompany(Guid companyId)
    {
        var userId = User.GetUserId();
        await _followingUseCase.FollowCompany(userId, companyId);
        return new ResponseBase<object>("Followed company successfully.");
    }

    [HttpGet("following/companies/liked-status")]
    public async Task<ActionResult<ResponseBase<FollowingCompaniesLikedStatusDto>>> GetLikedCompanyStatus(
        [FromQuery] List<Guid> companyIds)
    {
        var userId = User.GetUserId();
        var result = await _followingUseCase.GetLikedCompanyStatus(userId, companyIds);
        return new ResponseBase<FollowingCompaniesLikedStatusDto>(result);
    }
}
