using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.HR;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;

namespace JobHunter.Service.UseCase;

public class HRDashboardUseCase : IHRDashboardUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IJobRepository _jobRepository;
    private readonly IApplicationRepository _applicationRepository;

    public HRDashboardUseCase(
        IUserRepository userRepository,
        IJobRepository jobRepository,
        IApplicationRepository applicationRepository)
    {
        _userRepository = userRepository;
        _jobRepository = jobRepository;
        _applicationRepository = applicationRepository;
    }

    public async Task<PageResult<JobItemDto>> GetJobs(Guid userId, string? search, string? status, int page, int pageSize)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
            throw new KeyNotFoundException("Không tìm thấy người dùng");
        if (user.CompanyId == null)
            throw new UnauthorizedAccessException("Tài khoản HR chưa được liên kết với công ty");

        var companyId = user.CompanyId.Value;
        var items = await _jobRepository.GetHrJobs(companyId, search, status, page, pageSize);
        var total = await _jobRepository.CountHrJobs(companyId, search, status);

        return new PageResult<JobItemDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<PageResult<CandidateDto>> GetCandidates(Guid userId, Guid jobId, string? status, int page, int pageSize)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
            throw new KeyNotFoundException("Không tìm thấy người dùng");
        if (user.CompanyId == null)
            throw new UnauthorizedAccessException("Tài khoản HR chưa được liên kết với công ty");

        var isOwned = await _jobRepository.IsJobOwnedByCompany(jobId, user.CompanyId.Value);
        if (!isOwned)
            throw new KeyNotFoundException("Không tìm thấy công việc");

        var items = await _applicationRepository.GetCandidatesByJob(jobId, status, page, pageSize);
        var total = await _applicationRepository.CountCandidatesByJob(jobId, status);

        return new PageResult<CandidateDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }
}
