using JobHunter.Service.DTOs.Category;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;

namespace JobHunter.Service.UseCase;

public class CategoryUseCase : ICategoryUseCase
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryUseCase(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<List<CategoryDto>> GetCategories()
    {
        var categories = await _categoryRepository.GetCategoriesWithSubcategories();
        if (categories.Count == 0)
        {
            throw new KeyNotFoundException("Categories not found");
        }

        return categories.Select(category => new CategoryDto
        {
            Id = category.Id.ToString(),
            Name = category.Name ?? string.Empty,
            Subcategories = category.JobSubcategories
                .OrderBy(subcategory => subcategory.Name)
                .Select(subcategory => new SubcategoryDto
                {
                    Id = subcategory.Id.ToString(),
                    Name = subcategory.Name ?? string.Empty
                })
                .ToList()
        }).ToList();
    }
}
