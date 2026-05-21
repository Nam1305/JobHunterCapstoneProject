using JobHunter.Service.DTOs.Auth;

namespace JobHunter.Service.Interface.Service;

public interface IGoogleAuthService
{
    Task<GoogleUserInfoDto> GetUserInfoAsync(string accessToken);
}
