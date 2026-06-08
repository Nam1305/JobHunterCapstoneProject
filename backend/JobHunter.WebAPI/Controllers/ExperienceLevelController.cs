using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.ExperienceLevel;
using JobHunter.Service.Interface.UseCase;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/experienceLevels")]
[ApiController]
public class ExperienceLevelController : ControllerBase
{
    private readonly IExperienceLevelUseCase _experienceLevelUseCase;

    public ExperienceLevelController(IExperienceLevelUseCase experienceLevelUseCase)
    {
        _experienceLevelUseCase = experienceLevelUseCase;
    }

    [HttpGet]
    public async Task<ActionResult<ResponseBase<List<ExperienceLevelDto>>>> GetExperienceLevels()
    {
        var levels = await _experienceLevelUseCase.GetExperienceLevels();

        return new ResponseBase<List<ExperienceLevelDto>>(levels);
    }
}
