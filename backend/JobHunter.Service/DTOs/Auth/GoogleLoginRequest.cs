namespace JobHunter.Service.DTOs.Auth;

public class GoogleLoginRequest
{
    [System.Text.Json.Serialization.JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;
}
