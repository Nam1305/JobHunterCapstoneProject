

using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence;

public interface ITokenRepository
{
    Task SaveRefreshToken(Guid userId, string refreshToken);
    Task RevokeRefreshToken(string refreshToken);
    Task<RefreshToken?> GetValidRefreshToken(string refreshToken);
}