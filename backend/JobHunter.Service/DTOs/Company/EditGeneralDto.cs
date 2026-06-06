namespace JobHunter.Service.DTOs.Company
{
    public class EditGeneralDto
    {
        public string? Name { get; set; }

        public string? TeamSize { get; set; }

        public string? WebsiteUrl { get; set; }

        public string? Country { get; set; }

        public string? CompanyType { get; set; }
    }

    public class GeneralResponseDto : EditGeneralDto
    {
        public string? LogoUrl { get; set; }

        public string? CoverUrl { get; set; }
    }
}

