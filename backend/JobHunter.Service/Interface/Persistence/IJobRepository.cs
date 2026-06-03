using JobHunter.Domain.Entities;

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
}

public record JobFilterOptionsData(
    List<JobCategory> Categories,
    List<JobLevel> Levels,
    List<string> WorkTypes,
    List<string> Locations);
