using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Auth;
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

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ResponseBase<CurrentUserDto>>> GetCurrentUser()
    {
        var userId = User.GetUserId();
        var user = await _userUseCase.GetCurrentUser(userId);

        return new ResponseBase<CurrentUserDto>(user);
    }
}