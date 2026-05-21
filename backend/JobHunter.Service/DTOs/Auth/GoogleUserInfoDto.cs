using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.Auth;

public class GoogleUserInfoDto
{
    [JsonPropertyName("sub")]
    public string Subject { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("email_verified")]
    public bool EmailVerified { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("picture")]
    public string? Picture { get; set; }
}
