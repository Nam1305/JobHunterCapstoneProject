using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Interface.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace JobHunter.Service.Infrastructure.Persistence;

public class TokenRepository : ITokenRepository
{
    
    private readonly JobhunterContext _context;
    private readonly IConfiguration _configuration;
    
    public TokenRepository(JobhunterContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }
    
    public async Task SaveRefreshToken(Guid userId, string refreshToken)
    {
        var refreshTokenExpirationDays = int.TryParse(_configuration["Jwt:RefreshTokenExpirationDays"], out var days) ? days : 7;
        var newRefreshToken = new RefreshToken
        {
            UserId = userId,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpirationDays), // Long-lived refresh token
            CreatedAt = DateTime.UtcNow
        };
        await _context.RefreshTokens.AddAsync(newRefreshToken);
        await _context.SaveChangesAsync();
    }

    public async Task RevokeRefreshToken(string refreshToken)
    {
        var token = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
        if (token == null)
        {
            throw new KeyNotFoundException("Refresh token not found");
        }
        _context.RefreshTokens.Remove(token);
        await _context.SaveChangesAsync();
    }
    

    public async Task<RefreshToken?> GetValidRefreshToken(string refreshToken)
    {
        return await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && rt.ExpiresAt >= DateTime.UtcNow);
    }
}