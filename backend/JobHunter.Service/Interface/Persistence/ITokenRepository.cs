using System.Security.Claims;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Infrastructure.Persistence;

namespace JobHunter.Service.Interface.Persistence;

public interface ITokenRepository
{
    Task SaveRefreshToken(Guid userId, string refreshToken);
    Task RevokeRefreshToken(Guid tokenId);
    string GenerateAccessToken(CurrentUserDto user);
    string GenerateRefreshToken();
    ClaimsPrincipal ValidateAccessToken(string token);
    // Task<RefreshToken?> GetRefreshToken(string token);
}