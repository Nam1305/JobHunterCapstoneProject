using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence;

public interface ICategoryRepository
{
    Task<List<JobCategory>> GetCategoriesWithSubcategories();
}
