namespace JobHunter.Service.DTOs.Category;

public class CategoryDto
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public List<SubcategoryDto> Subcategories { get; set; } = new();
}
