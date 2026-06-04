using System.Text.Json;
using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.Service;

public class HrCompanyUseCase : IHrCompanyUseCase
{
    private readonly IHrCompanyRepository _hrCompanyRepository;

    private readonly IUserRepository _userRepository;

    private readonly IFileService _fileService;

    public HrCompanyUseCase(IHrCompanyRepository hrCompanyRepository, IUserRepository userRepository, IFileService fileService)
    {
        _hrCompanyRepository = hrCompanyRepository;
        _userRepository = userRepository;
        _fileService = fileService;
    }


    public async Task<List<string>> AddTeamImagesAsync(BrandImageDto brandImageDto)
    {
        if (brandImageDto.Images == null || !brandImageDto.Images.Any())
            throw new ArgumentException("Không có ảnh nào được gửi lên.", nameof(brandImageDto.Images));

        if (brandImageDto.Images.Count > 5)
            throw new ArgumentException("Chỉ được upload tối đa 5 ảnh cùng lúc.", nameof(brandImageDto.Images));

        //  2. lấy thông tin cty qua uid
        var user = await _userRepository.GetUserById(brandImageDto.UserId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (!user.CompanyId.HasValue)
        {
            throw new InvalidOperationException("User is not assigned to a company");
        }

        var company = await _hrCompanyRepository.GetByIdAsync(user.CompanyId.Value);
        if (company == null)
        {
            throw new KeyNotFoundException("Company not found");
        }

        // 3. Upload ảnh song song lên S3
        var newUploadedUrls = await _fileService.UploadMultipleFilesAsync(brandImageDto.Images);
        
        if (!newUploadedUrls.Any())
            throw new InvalidOperationException("Upload ảnh thất bại.");

        // 4. Xử lý JsonDocument (Phần quan trọng nhất)
        List<string> currentUrls = new List<string>();

        if (company.TeamPhotoUrls != null)
        {
            // Dịch ngược JsonDocument cũ trong DB ra thành List<string>
            currentUrls = JsonSerializer.Deserialize<List<string>>(company.TeamPhotoUrls) ?? new List<string>();
        }

        // Nối các link S3 mới vừa up vào danh sách cũ
        currentUrls.AddRange(newUploadedUrls);

        // Đóng gói List đó ngược lại thành JsonDocument mới và gán lại cho Entity
        company.TeamPhotoUrls = JsonSerializer.SerializeToDocument(currentUrls);

        // 5. Cập nhật vào DB
        await _hrCompanyRepository.AddTeamImagesAsync(company.Id, currentUrls);

        return newUploadedUrls;
    
    }
}