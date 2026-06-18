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

    public CandidateController(ICandidateResumeUseCase candidateResumeUseCase)
    {
        _candidateResumeUseCase = candidateResumeUseCase;
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
}
