public class EditBrandingDto
{
    public Guid UserId { get; set; }

    public string? Overview { get; set; }

    public string? Benefits { get; set; }

}

public class BrandingResponseDto : EditBrandingDto
{

    public List<string>? TeamPhotoUrls { get; set; }
}