using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs.Candidate;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.Service;
using JobHunter.Service.Interface.UseCase;
using Microsoft.AspNetCore.Http;

namespace JobHunter.Service.UseCase;

public class CandidateResumeUseCase : ICandidateResumeUseCase
{
    private readonly IResumeRepository _resumeRepository;
    private readonly IFileService _fileService;

    public CandidateResumeUseCase(IResumeRepository resumeRepository, IFileService fileService)
    {
        _resumeRepository = resumeRepository;
        _fileService = fileService;
    }

    public async Task<List<ResumeDto>> GetResumes(Guid userId)
    {
        var resumes = await _resumeRepository.GetResumesByUserId(userId);
        return resumes.Select(ResumeDto.From).ToList();
    }

    public async Task<ResumeDto> UploadResume(Guid userId, IFormFile file)
    {
        var fileUrl = await _fileService.UploadFileAsync(file);

        var resume = new Resume
        {
            UserId = userId,
            FileName = file.FileName,
            FileUrl = fileUrl,
            IsPublic = false
        };

        var saved = await _resumeRepository.AddResume(resume);
        return ResumeDto.From(saved);
    }

    public async Task<ResumeDto> ToggleLookingForJobStatus(Guid userId, Guid resumeId, bool isLookingForJob)
    {
        var resume = await _resumeRepository.GetResumeById(resumeId)
            ?? throw new KeyNotFoundException("Không tìm thấy CV");

        if (resume.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền chỉnh sửa CV này");

        resume.IsPublic = isLookingForJob;
        await _resumeRepository.UpdateResume(resume);
        return ResumeDto.From(resume);
    }

    public async Task DeleteResume(Guid userId, Guid resumeId)
    {
        var resume = await _resumeRepository.GetResumeById(resumeId)
            ?? throw new KeyNotFoundException("Không tìm thấy CV");

        if (resume.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền xóa CV này");

        if (resume.FileUrl != null)
            await _fileService.DeleteFileAsync(resume.FileUrl);

        await _resumeRepository.DeleteResume(resume);
    }
}
