using JobHunter.Service.DTOs.Candidate;

namespace JobHunter.Service.Interface.UseCase;

public interface IFollowingUseCase
{
    Task<FollowingToggleResultDto> ToggleJobLike(Guid userId, Guid jobId);
    Task<FollowingToggleResultDto> ToggleCompanyLike(Guid userId, Guid companyId);
    Task<FollowingJobsLikedStatusDto> GetLikedJobStatus(Guid userId, List<Guid> jobIds);
    Task<FollowingCompaniesLikedStatusDto> GetLikedCompanyStatus(Guid userId, List<Guid> companyIds);
}
