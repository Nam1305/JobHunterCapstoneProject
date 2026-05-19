using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Infrastructure.Persistence;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace JobHunter.Service.UseCase;

public class AuthUseCase : IAuthUseCase
{
    private readonly ITokenRepository _tokenRepository;
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    
    public AuthUseCase(ITokenRepository tokenRepository, IUserRepository userRepository, IConfiguration configuration)
    {
        _tokenRepository = tokenRepository;
        _userRepository = userRepository;
        _configuration = configuration;
    }
    
    private string GenerateAccessToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // FIX: Guid to string
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString()), // Critical for [Authorize(Roles = "Admin")]
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(
                JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"])
        );

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15), // Short-lived access token
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
    
    private ClaimsPrincipal ValidateAccessToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Secret"]);

        try
        {
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = false, // We'll handle expiration separately
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch (SecurityTokenException ex)
        {
            throw new UnauthorizedAccessException($"Token không hợp lệ: {ex.Message}");
        }
        catch (Exception ex)
        {
            throw new UnauthorizedAccessException($"Lỗi xác thực token: {ex.Message}");
        }
    }
    
    public async Task<TokenResultDto?> Login(LoginDto request)
    {
        var user = await _userRepository.GetUserByEmail(request.Email);
        if (user == null ||
            !Utils.PasswordHashing.VerifyPassword(request.Password, user.Password))
        {
            throw new KeyNotFoundException("Không tìm thấy thông tin tài khoản");
        }

        
        var accessToken = GenerateAccessToken(user);
        var refreshToken =  GenerateRefreshToken();
        
        await _tokenRepository.SaveRefreshToken(user.Id, refreshToken);
        
        return new TokenResultDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
        };
    }

    public async Task RevokeRefreshToken(string refreshToken)
    {
        await _tokenRepository.RevokeRefreshToken(refreshToken);
    }

    public async Task<TokenResultDto?> RefreshToken(string refreshToken)
    {
        // Validate token from database
        var storedToken = await _tokenRepository.GetValidRefreshToken(refreshToken);
        if (storedToken == null)
        {
            throw new UnauthorizedAccessException("Token không hợp lệ");
        }
        
        // Get user from database
        var user = await _userRepository.GetUserById(storedToken.UserId);

        if (user == null)
        {
            throw new KeyNotFoundException("Không tìm thấy người dùng");
        }
        
        // Generate new token
        var newAccessToken = GenerateAccessToken(user);
        var newRefreshToken = GenerateRefreshToken();
        
        // Revoke old and save new
        await _tokenRepository.RevokeRefreshToken(refreshToken);
        await _tokenRepository.SaveRefreshToken(user.Id, newRefreshToken);
        
        return new TokenResultDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
        };
    }
}
