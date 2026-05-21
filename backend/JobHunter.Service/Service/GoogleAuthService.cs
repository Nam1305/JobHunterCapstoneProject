using System.Net.Http.Headers;
using System.Net.Http.Json;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Interface.Service;

namespace JobHunter.Service.Service;

public class GoogleAuthService : IGoogleAuthService
{
    private const string UserInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";
    private readonly HttpClient _httpClient;

    public GoogleAuthService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<GoogleUserInfoDto> GetUserInfoAsync(string accessToken)
    {
        if (string.IsNullOrWhiteSpace(accessToken))
        {
            throw new ArgumentException("Không tìm thấy Google access token");
        }

        using var request = new HttpRequestMessage(HttpMethod.Get, UserInfoUrl);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        using var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            throw new UnauthorizedAccessException("Google access token không hợp lệ");
        }

        var userInfo = await response.Content.ReadFromJsonAsync<GoogleUserInfoDto>();
        if (userInfo == null ||
            string.IsNullOrWhiteSpace(userInfo.Subject) ||
            string.IsNullOrWhiteSpace(userInfo.Email))
        {
            throw new UnauthorizedAccessException("Không thể xác thực thông tin Google");
        }

        return userInfo;
    }
}
