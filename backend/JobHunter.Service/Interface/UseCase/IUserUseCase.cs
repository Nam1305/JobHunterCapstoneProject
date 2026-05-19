using JobHunter.Service.DTOs.Auth;

namespace JobHunter.Service.Interface.UseCase;

public interface IUserUseCase
{
    Task<CurrentUserDto> GetCurrentUser(Guid userId);
}
