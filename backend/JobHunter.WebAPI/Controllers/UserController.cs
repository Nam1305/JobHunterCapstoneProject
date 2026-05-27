using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.DTOs.User;
using JobHunter.Service.Interface.Service;
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

    private readonly IFileService _fileService;
    
    public UserController(IUserUseCase userUseCase, IFileService fileService)
    {
        _userUseCase = userUseCase;
        _fileService = fileService;
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

    [HttpPut("me")]
    public async Task<ActionResult<ResponseBase<CurrentUserDto>>> UpdateUser([FromBody] UpdateUserRequestDto request)
    {
        //get user id from token
        var userId = User.GetUserId();
        var user = await _userUseCase.UpdateUser(userId, request);
        return new ResponseBase<CurrentUserDto>(user);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseBase<string>>> DeleteUser(Guid id)
    {
        await _userUseCase.DeleteUser(id);
        return new ResponseBase<string>("User deleted successfully");
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseBase<CurrentUserDto>>> CreateUser([FromBody] CreateUserDto request)
    {
        var user = await _userUseCase.CreateUser(request);
        return new ResponseBase<CurrentUserDto>(user);
    }

    [HttpPost("avatar")]
    [Authorize]
    public async Task<ActionResult<ResponseBase<string>>> UpdateAvatar(IFormFile request)
    {
        var userId = User.GetUserId();
        var avatarUrl = await _fileService.UploadFileAsync(request);
        await _userUseCase.UpdateAvatar(userId, avatarUrl);
        return new ResponseBase<string>("Avatar updated successfully");
    }
}
