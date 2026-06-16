using System.Security.Claims;

using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Interface.Persistence;

namespace JobHunter.Service.Interface.UseCase;

public interface IAuthUseCase
{
    Task<TokenResultDto> Login(LoginDto request);
    Task<TokenResultDto> GoogleLogin(GoogleLoginRequest request);
    Task RevokeRefreshToken(string refreshToken);
    Task<TokenResultDto> RefreshToken(string refreshToken);
}
