using System.Security.Claims;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Infrastructure.Persistence;

namespace JobHunter.Service.Interface.Persistence;

public interface ITokenRepository
{
    Task SaveRefreshToken(Guid userId, string refreshToken);
    Task RevokeRefreshToken(string refreshToken);
    Task<RefreshToken?> GetValidRefreshToken(string refreshToken);
}