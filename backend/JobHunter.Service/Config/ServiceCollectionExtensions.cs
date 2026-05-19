using JobHunter.Service.Infrastructure.Persistence;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.UseCase;
using Microsoft.Extensions.DependencyInjection;

namespace JobHunter.Service.Config;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Repositories
        services.AddScoped<ITokenRepository, TokenRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
       
        // Use cases
        services.AddScoped<IAuthUseCase, AuthUseCase>();
        services.AddScoped<IUserUseCase, UserUseCase>();
        
        return services;
    }
}
