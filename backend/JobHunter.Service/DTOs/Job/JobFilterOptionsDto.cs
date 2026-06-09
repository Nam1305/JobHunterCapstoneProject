namespace JobHunter.Service.DTOs.Job;

public class JobFilterOptionsDto
{
    public List<CategoryOptionDto> Categories { get; set; } = [];
    public List<LevelOptionDto> Levels { get; set; } = [];
    public List<string> WorkTypes { get; set; } = [];
    public List<string> Locations { get; set; } = [];
}

public class CategoryOptionDto
{
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public List<SubcategoryOptionDto> Subcategories { get; set; } = [];
}

public class SubcategoryOptionDto
{
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
}

public class LevelOptionDto
{
    public string Name { get; set; } = null!;
    public string Slug { get; set; } = null!;
}
