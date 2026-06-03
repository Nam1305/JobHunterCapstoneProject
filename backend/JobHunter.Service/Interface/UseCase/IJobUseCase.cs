using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Job;

namespace JobHunter.Service.Interface.UseCase;

public interface IJobUseCase
{
    Task<List<JobCardDto>> GetTopJobs(int limit);
    Task<PageResult<JobDetailsDto>> GetJobs(
        string? search,
        string? location,
        string? companySlug,
        List<string> categorySlugs,
        List<string> subcategorySlugs,
        List<string> levelSlugs,
        List<string> workTypes,
        int page,
        int pageSize);
    Task<JobDetailsDto> GetJobBySlug(string slug);
    Task<JobFilterOptionsDto> GetFilterOptions();
}
