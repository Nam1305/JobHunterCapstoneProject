using JobHunter.Domain.Entities;
using JobHunter.Domain.Enums;
using JobHunter.Service.DTOs.HR;

namespace JobHunter.Service.Interface.Persistence;

public interface IApplicationRepository
{
    Task<List<CandidateDto>> GetCandidatesByJob(Guid jobId, string? status, int page, int pageSize);
    Task<int> CountCandidatesByJob(Guid jobId, string? status);
    Task<ApplicationDetailDto?> GetApplicationDetail(Guid applicationId);
    Task<Guid?> GetJobIdByApplication(Guid applicationId);
    Task UpdateApplicationStatus(Guid applicationId, ApplicationStatus status);
    Task<bool> HasApplied(Guid userId, Guid jobId);
    Task<Application?> GetApplicationByCandidateAndJob(Guid userId, Guid jobId);
    Task<Application> AddApplication(Application application);
}
