using JobHunter.Service.DTOs.ExperienceLevel;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;

namespace JobHunter.Service.UseCase;

public class ExperienceLevelUseCase : IExperienceLevelUseCase
{
    private readonly IExperienceLevelRepository _experienceLevelRepository;

    public ExperienceLevelUseCase(IExperienceLevelRepository experienceLevelRepository)
    {
        _experienceLevelRepository = experienceLevelRepository;
    }

    public async Task<List<ExperienceLevelDto>> GetExperienceLevels()
    {
        var levels = await _experienceLevelRepository.GetExperienceLevels();
        if (levels.Count == 0)
        {
            throw new KeyNotFoundException("Experience levels not found");
        }

        return levels.Select(level => new ExperienceLevelDto
        {
            Id = level.Id,
            Name = level.Title ?? string.Empty
        }).ToList();
    }
}
