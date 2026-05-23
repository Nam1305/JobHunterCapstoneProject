using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.DTOs.User;
using JobHunter.Service.DTOs;

namespace JobHunter.Service.Interface.UseCase;

public interface IUserUseCase
{
    Task<CurrentUserDto> GetCurrentUser(Guid userId);

    Task<PageResult<UserInfoDto>> GetUsers(string? search, int page, int pageSize);

    Task Register(RegisterRequestDto request);

    Task<CurrentUserDto> UpdateUser(Guid userId, UpdateUserRequestDto request);

    Task<CurrentUserDto> CreateUser(CreateUserDto request);

    Task DeleteUser(Guid userId);
}
