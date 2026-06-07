using JobHunter.Service.DTOs.Category;

namespace JobHunter.Service.Interface.UseCase;

public interface ICategoryUseCase
{
    Task<List<CategoryDto>> GetCategories();
}
