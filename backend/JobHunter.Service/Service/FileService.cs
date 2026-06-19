using Amazon.S3;
using Amazon.S3.Model;
using JobHunter.Service.Interface.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace JobHunter.Service.Service;

public class FileService : IFileService
{
    private readonly IAmazonS3 _s3Client;
    private readonly ILogger<FileService> _logger;
    private readonly string _bucketName;
    private readonly string _publicUrl;

    public FileService(IAmazonS3 s3Client, ILogger<FileService> logger, string bucketName, string publicUrl)
    {
        _s3Client = s3Client;
        _logger = logger;
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

    public async Task<List<string>> UploadMultipleFilesAsync(List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
        {
            throw new ArgumentException("No files uploaded.", nameof(files));
        }

        var uploadedUrls = new string?[files.Count];
        var indexedFiles = files.Select((file, index) => new { File = file, Index = index });
        var parallelOptions = new ParallelOptions { MaxDegreeOfParallelism = 5 };

        await Parallel.ForEachAsync(indexedFiles, parallelOptions, async (item, cancellationToken) =>
        {
            try
            {
                uploadedUrls[item.Index] = await UploadFileAsync(item.File);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Failed to upload file {FileName} in multiple file upload.",
                    item.File?.FileName);
            }
        });

        return uploadedUrls
            .Where(url => url != null)
            .Select(url => url!)
            .ToList();
    }
}
