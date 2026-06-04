using Microsoft.AspNetCore.Http;

namespace JobHunter.Service.Interface.Service;

public interface IFileService
{
    Task<string> UploadFileAsync(IFormFile file);

    Task<List<string>> UploadMultipleFilesAsync(List<IFormFile> files);
    Task DeleteFileAsync(string fileUrl);
}
