using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.DTOs.User;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserUseCase _userUseCase;
    
    public UserController(IUserUseCase userUseCase)
    {
        _userUseCase = userUseCase;
    }

    [HttpGet]
    public async Task<ActionResult<ResponseBase<PageResult<UserInfoDto>>>> GetUsers(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var users = await _userUseCase.GetUsers(search, page, pageSize);
        return new ResponseBase<PageResult<UserInfoDto>>(users);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ResponseBase<CurrentUserDto>>> GetCurrentUser()
    {
        var userId = User.GetUserId();
        var user = await _userUseCase.GetCurrentUser(userId);

        return new ResponseBase<CurrentUserDto>(user);
    }

    [HttpPost("register")]
    public async Task<ActionResult<ResponseBase<string>>> Register([FromBody] RegisterRequestDto request)
    {
        await _userUseCase.Register(request);
        return new ResponseBase<string>("User registered successfully");
    }

    [HttpPut("{id:guid}")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseBase<CurrentUserDto>>> UpdateUser(Guid id, [FromBody] UpdateUserRequestDto request)
    {
        var user = await _userUseCase.UpdateUser(id, request);
        return new ResponseBase<CurrentUserDto>(user);
    }

    [HttpDelete("{id:guid}")]
    // [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseBase<string>>> DeleteUser(Guid id)
    {
        await _userUseCase.DeleteUser(id);
        return new ResponseBase<string>("User deleted successfully");
    }
}
