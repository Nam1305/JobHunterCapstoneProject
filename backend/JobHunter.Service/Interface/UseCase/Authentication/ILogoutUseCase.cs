namespace JobHunter.Service.Interface.UseCase;

public interface ILogoutUseCase
{
    Task ExecuteAsync(string refreshToken);
}