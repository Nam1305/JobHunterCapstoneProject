using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs.HR;

namespace JobHunter.Service.Interface.Persistence;

public interface IJobRepository
{
    Task<List<Job>> GetTopJobs(int limit);
    Task<(List<Job> Items, int TotalCount)> GetJobs(
        string? search,
        string? location,
        string? companySlug,
        List<string> categorySlugs,
        List<string> subcategorySlugs,
        List<string> levelSlugs,
        List<string> workTypes,
        int page,
        int pageSize);
    Task<Job?> GetJobBySlug(string slug);
    Task<JobFilterOptionsData> GetFilterOptions();
    Task<List<JobItemDto>> GetHrJobs(Guid companyId, string? search, string? status, int page, int pageSize);
    Task<int> CountHrJobs(Guid companyId, string? search, string? status);
    Task<bool> IsJobOwnedByCompany(Guid jobId, Guid companyId);
    Task<Guid?> GetJobIdBySlug(string slug);
    Task<bool> IsJobExists(Guid jobId);
}

public record JobFilterOptionsData(
    List<JobCategory> Categories,
    List<JobLevel> Levels,
    List<string> WorkTypes,
    List<string> Locations);

