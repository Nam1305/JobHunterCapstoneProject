using JobHunter.Domain.Entities;
using JobHunter.Domain.Enums;
using JobHunter.Service.DTOs.Candidate;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.Service;
using JobHunter.Service.Interface.UseCase;
using Microsoft.AspNetCore.Http;

namespace JobHunter.Service.UseCase;

public class CandidateResumeUseCase : ICandidateResumeUseCase
{
    private readonly IResumeRepository _resumeRepository;
    private readonly IApplicationRepository _applicationRepository;
    private readonly IJobRepository _jobRepository;
    private readonly IFileService _fileService;

    public CandidateResumeUseCase(
        IResumeRepository resumeRepository,
        IApplicationRepository applicationRepository,
        IJobRepository jobRepository,
        IFileService fileService)
    {
        _resumeRepository = resumeRepository;
        _applicationRepository = applicationRepository;
        _jobRepository = jobRepository;
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

    public async Task<ApplicationResultDto> ApplyJob(Guid userId, ApplyJobRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email không được để trống");

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Tên không được để trống");

        if (string.IsNullOrWhiteSpace(request.Phone))
            throw new ArgumentException("Số điện thoại không được để trống");

        var resume = await _resumeRepository.GetResumeById(request.ResumeId)
            ?? throw new KeyNotFoundException("Không tìm thấy CV");

        if (resume.UserId != userId)
            throw new UnauthorizedAccessException("CV này không thuộc về bạn");

        var jobExists = await _jobRepository.IsJobExists(request.JobId);
        if (!jobExists)
            throw new KeyNotFoundException("Không tìm thấy công việc");

        var alreadyApplied = await _applicationRepository.HasApplied(userId, request.JobId);
        if (alreadyApplied)
            throw new ArgumentException("Bạn đã ứng tuyển công việc này rồi");

        var application = new Application
        {
            ResumeId = request.ResumeId,
            JobId = request.JobId,
            Email = request.Email.Trim(),
            Name = request.Name.Trim(),
            Phone = request.Phone.Trim(),
            CoverLetter = request.CoverLetter,
            Status = ApplicationStatus.Pending,
            AppliedAt = DateTimeOffset.UtcNow
        };

        var saved = await _applicationRepository.AddApplication(application);
        return ApplicationResultDto.From(saved);
    }
}
