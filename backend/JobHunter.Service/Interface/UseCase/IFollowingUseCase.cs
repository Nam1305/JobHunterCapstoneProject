using JobHunter.Service.DTOs.Candidate;

namespace JobHunter.Service.Interface.UseCase;

public interface IFollowingUseCase
{
    Task FollowJob(Guid userId, Guid jobId);
    Task FollowCompany(Guid userId, Guid companyId);
    Task<FollowingJobsLikedStatusDto> GetLikedJobStatus(Guid userId, List<Guid> jobIds);
    Task<FollowingCompaniesLikedStatusDto> GetLikedCompanyStatus(Guid userId, List<Guid> companyIds);
}
