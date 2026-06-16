using JobHunter.Service.DTOs.Candidate;
using Microsoft.AspNetCore.Http;

namespace JobHunter.Service.Interface.UseCase;

public interface ICandidateResumeUseCase
{
    Task<List<ResumeDto>> GetResumes(Guid userId);
    Task<ResumeDto> UploadResume(Guid userId, IFormFile file);
    Task<ResumeDto> ToggleLookingForJobStatus(Guid userId, Guid resumeId, bool isLookingForJob);
    Task DeleteResume(Guid userId, Guid resumeId);
    Task<ApplicationResultDto> ApplyJob(Guid userId, ApplyJobRequestDto request);
}
