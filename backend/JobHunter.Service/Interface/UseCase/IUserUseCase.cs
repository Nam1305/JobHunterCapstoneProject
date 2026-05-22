using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.DTOs.User;

namespace JobHunter.Service.Interface.UseCase;

public interface IUserUseCase
{
    Task<CurrentUserDto> GetCurrentUser(Guid userId);

    Task Register(RegisterRequestDto request);

    Task<CurrentUserDto> UpdateUser(Guid userId, UpdateUserRequestDto request);
}
