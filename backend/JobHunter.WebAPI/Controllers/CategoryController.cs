using JobHunter.Service.DTOs.Category;
using JobHunter.Service.Interface.UseCase;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/categories")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryUseCase _categoryUseCase;

    public CategoryController(ICategoryUseCase categoryUseCase)
    {
        _categoryUseCase = categoryUseCase;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        var categories = await _categoryUseCase.GetCategories();

        return categories;
    }
}
