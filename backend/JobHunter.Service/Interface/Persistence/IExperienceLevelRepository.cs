using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence;

public interface IExperienceLevelRepository
{
    Task<List<JobLevel>> GetExperienceLevels();
}
