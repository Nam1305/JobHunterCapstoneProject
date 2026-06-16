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

    [HttpGet("resumes")]
    public async Task<ActionResult<ResponseBase<List<ResumeDto>>>> GetResumes()
    {
        var userId = User.GetUserId();
        var result = await _candidateResumeUseCase.GetResumes(userId);
        return new ResponseBase<List<ResumeDto>>(result);
    }

    [HttpPost("resumes")]
    public async Task<ActionResult<ResponseBase<ResumeDto>>> UploadResume(IFormFile file)
    {
        var userId = User.GetUserId();
        var result = await _candidateResumeUseCase.UploadResume(userId, file);
        return new ResponseBase<ResumeDto>(result);
    }

    [HttpPatch("resumes/{resumeId:guid}/status")]
    public async Task<ActionResult<ResponseBase<ResumeDto>>> ToggleStatus(
        Guid resumeId,
        [FromBody] UpdateResumeStatusRequestDto request)
    {
        var userId = User.GetUserId();
        var result = await _candidateResumeUseCase.ToggleLookingForJobStatus(userId, resumeId, request.IsLookingForJob);
        return new ResponseBase<ResumeDto>(result);
    }

    [HttpDelete("resumes/{resumeId:guid}")]
    public async Task<ActionResult<ResponseBase<object>>> DeleteResume(Guid resumeId)
    {
        var userId = User.GetUserId();
        await _candidateResumeUseCase.DeleteResume(userId, resumeId);
        return new ResponseBase<object>(null);
    }
}
