namespace JobHunter.Service.Interface.UseCase;

public interface IRefreshTokenUseCase
{
    Task ExecuteAsync(string refreshToken);
}
