using Amazon.Runtime;
using Amazon.S3;
using JobHunter.Service.Infrastructure.Persistence;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.Service;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Service;
using JobHunter.Service.UseCase;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace JobHunter.Service.Config;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Repositories
        services.AddScoped<ITokenRepository, TokenRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IJobRepository, JobRepository>();
        services.AddScoped<IHrCompanyRepository, HrCompanyRepository>();
       
        // Use cases
        services.AddScoped<IAuthUseCase, AuthUseCase>();
        services.AddScoped<IUserUseCase, UserUseCase>();
        services.AddScoped<IHrJobUseCase, HrJobUseCase>();
        services.AddScoped<IHrCompanyUseCase, HrCompanyUseCase>();
        
        // Services
        services.AddHttpClient<IGoogleAuthService, GoogleAuthService>();
        services.AddSingleton<IAmazonS3>(_ =>
        {
            var accessKey = GetRequiredConfigValue(configuration, "S3Credential:ACCESS_KEY");
            var secretKey = GetRequiredConfigValue(configuration, "S3Credential:SECRET_KEY");
            var apiEndpoint = GetRequiredConfigValue(configuration, "S3Credential:ApiEndpoint");

            var credentials = new BasicAWSCredentials(accessKey, secretKey);
            var config = new AmazonS3Config
            {
                ServiceURL = apiEndpoint,
                ForcePathStyle = true
            };

            return new AmazonS3Client(credentials, config);
        });
        services.AddScoped<IFileService>(provider =>
        {
            var bucketName = GetRequiredConfigValue(configuration, "S3Credential:BUCKET_NAME");
            var publicUrl = GetRequiredConfigValue(configuration, "S3Credential:PublicUrl");
            var s3Client = provider.GetRequiredService<IAmazonS3>();
            var logger = provider.GetRequiredService<ILogger<FileService>>();

            return new FileService(s3Client, logger, bucketName, publicUrl);
        });
        
        return services;
    }

    private static string GetRequiredConfigValue(IConfiguration configuration, string key)
    {
        return configuration[key]
            ?? throw new InvalidOperationException($"Missing configuration value: {key}");
    }
}
