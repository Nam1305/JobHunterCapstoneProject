using JobHunter.Service.DTOs.ExperienceLevel;

namespace JobHunter.Service.Interface.UseCase;

public interface IExperienceLevelUseCase
{
    Task<List<ExperienceLevelDto>> GetExperienceLevels();
}
