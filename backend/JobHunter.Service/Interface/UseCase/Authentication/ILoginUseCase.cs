using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Infrastructure.Persistence;

namespace JobHunter.Service.Interface.UseCase;

public interface ILoginUseCase
{
    Task<CurrentUserDto?> ExecuteAsync(LoginDto request);
}