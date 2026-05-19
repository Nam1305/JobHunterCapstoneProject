namespace JobHunter.Service.DTOs.Auth;

public class TokenResultDto
{
    public string AccessToken { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
}