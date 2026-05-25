using Microsoft.AspNetCore.Http;

namespace JobHunter.Service.Interface.Service;

public interface IFileService
{
    Task<string> UploadFileAsync(IFormFile file);
    Task DeleteFileAsync(string fileUrl);
}
