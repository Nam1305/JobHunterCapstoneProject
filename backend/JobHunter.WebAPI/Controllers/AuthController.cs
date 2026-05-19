using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Utils;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    
    private readonly IAuthUseCase _authUseCase;
    
    public AuthController(IAuthUseCase authUseCase)
    {
        _authUseCase = authUseCase;
    }
    
    [HttpPost("login")]
    public async Task<ActionResult<ResponseBase<string>>> Login([FromBody] LoginDto loginDto)
    {
        var result = await _authUseCase.Login(loginDto);
        SetTokenCookies.SetTokenCookiesToResponse(Response, result.AccessToken, result.RefreshToken);
        return new ResponseBase<string>("Đăng nhập thành công");
    }

    [HttpPost("logout")]
    public async Task<ActionResult<ResponseBase<string>>> Logout()
    {
        // 1. Get a refresh token from cookies
        var refreshToken = Request.Cookies["refresh_token"];
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _authUseCase.RevokeRefreshToken(refreshToken);
        }
        
        // Remove cookies
        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");
        return new ResponseBase<string>("Đăng xuất thành công");
    }


    [HttpPost("refresh")]
    public async Task<ActionResult<ResponseBase<string>>> Refresh()
    {
        var refreshToken = Request.Cookies["refresh_token"];
        if (string.IsNullOrEmpty(refreshToken))
            throw new UnauthorizedAccessException("Không tìm thấy refresh token");
        var newTokens = await _authUseCase.RefreshToken(refreshToken);
        // Set to cookie
        SetTokenCookies.SetTokenCookiesToResponse(Response, newTokens.AccessToken, newTokens.RefreshToken);
        return new ResponseBase<string>("Refresh thành công");
    }
}