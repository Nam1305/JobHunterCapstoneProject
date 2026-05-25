using Amazon.S3;
using Amazon.S3.Model;
using JobHunter.Service.Interface.Service;
using Microsoft.AspNetCore.Http;

namespace JobHunter.Service.Service;

public class FileService : IFileService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string _publicUrl;
    
    public FileService(IAmazonS3 s3Client, string bucketName, string publicUrl)
    {
        _s3Client = s3Client;
        _bucketName = bucketName;
        _publicUrl = publicUrl;
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("No file uploaded.", nameof(file));
        }

        var objectKey = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        await using var stream = file.OpenReadStream();
        var request = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = objectKey,
            ContentType = file.ContentType,
            InputStream = stream,
            DisablePayloadSigning = true,
            DisableDefaultChecksumValidation = true
        };

        await _s3Client.PutObjectAsync(request);

        return _publicUrl.Contains("r2-storage")
            ? $"{_publicUrl}/{objectKey}"
            : $"{_publicUrl}/{_bucketName}/{objectKey}";
    }

    public Task DeleteFileAsync(string fileUrl)
    {
        var fileName = fileUrl.Split('/').Last();
        var deleteReq = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = fileName
        };

        return _s3Client.DeleteObjectAsync(deleteReq);
    }
}
