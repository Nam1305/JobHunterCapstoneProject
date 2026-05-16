# JobHunter V1

Dự án **JobHunter** là một RESTful Web API được xây dựng trên nền tảng **.NET 10**, áp dụng kiến trúc **3 tầng (3-Layer Architecture)** với sự tách biệt rõ ràng giữa các mối quan tâm (Separation of Concerns).

---

## 📐 Kiến trúc tổng quan

```
┌────────────────────────────────────┐
│          JobHunter.WebAPI          │  ← Tầng trình bày (Presentation Layer)
│  Controllers, Middlewares, Config  │
└────────────────┬───────────────────┘
                 │ references
                 ▼
┌────────────────────────────────────┐
│         JobHunter.Service          │  ← Tầng nghiệp vụ (Business / Application Layer)
│  UseCases, Services, Interfaces,   │
│  DTOs, Infrastructure, Constants   │
└────────────────┬───────────────────┘
                 │ references
                 ▼
┌────────────────────────────────────┐
│          JobHunter.Domain          │  ← Tầng miền (Domain Layer)
│       Entities, BaseEntity         │
└────────────────────────────────────┘
```

**Nguyên tắc phụ thuộc (Dependency Rule):**
- `WebAPI` → `Service` → `Domain`
- Tầng dưới **không được biết** đến tầng trên
- Không có circular dependency

---

## 📁 Cấu trúc thư mục

```
JobHunter_V1/
├── JobHunter_V1.slnx                    # Solution file
│
├── JobHunter.Domain/                    # 🔵 Domain Layer
│   ├── JobHunter.Domain.csproj
│   ├── BaseEntity.cs                    # Base class cho tất cả Entity
│   └── Entities/                        # Các Entity của domain
│       ├── User.cs                      # (ví dụ)
│       ├── Job.cs
│       └── ...
│
├── JobHunter.Service/                   # 🟡 Business / Application Layer
│   ├── JobHunter.Service.csproj
│   │
│   ├── DTOs/                            # Data Transfer Objects dùng chung
│   │   ├── ResponseBase.cs              # Wrapper chuẩn hóa response API
│   │   └── PageResult.cs               # Wrapper cho kết quả phân trang
│   │
│   ├── Constant/                        # Hằng số toàn dự án
│   │   └── (AppConstants.cs, ...)
│   │
│   ├── Config/                          # Cấu hình dịch vụ, options pattern
│   │   └── (JwtConfig.cs, SmtpConfig.cs, ...)
│   │
│   ├── Interface/                       # Định nghĩa contract (abstractions)
│   │   ├── Persistence/                 # Interface cho Repository
│   │   │   └── (IUserRepository.cs, IJobRepository.cs, ...)
│   │   ├── Service/                     # Interface cho External Services
│   │   │   └── (IEmailService.cs, IStorageService.cs, ...)
│   │   └── UseCase/                     # Interface cho Use Cases
│   │       └── (ICreateJobUseCase.cs, ISearchJobUseCase.cs, ...)
│   │
│   ├── Infrastructure/                  # Triển khai kỹ thuật (kết nối DB, ORM)
│   │   └── Persistence/                 # Cài đặt Repository pattern (EF Core)
│   │       └── (UserRepository.cs, JobRepository.cs, ...)
│   │
│   ├── UseCase/                         # Triển khai nghiệp vụ chính (Business Logic)
│   │   └── (CreateJobUseCase.cs, SearchJobUseCase.cs, ...)
│   │
│   └── Service/                         # Triển khai dịch vụ ngoại vi
│       └── (EmailService.cs, CloudStorageService.cs, ...)
│
└── JobHunter.WebAPI/                    # 🔴 Presentation / API Layer
    ├── JobHunter.WebAPI.csproj
    ├── Program.cs                       # Entry point, DI configuration
    ├── appsettings.json                 # Cấu hình môi trường production
    ├── appsettings.Development.json     # Cấu hình môi trường development
    │
    ├── Controllers/                     # API Controllers
    │   ├── BaseController.cs            # Controller gốc (xử lý exception chuẩn)
    │   └── (UserController.cs, JobController.cs, ...)
    │
    ├── Middlewares/                     # Custom middleware pipeline
    │   └── (ExceptionMiddleware.cs, AuthMiddleware.cs, ...)
    │
    └── Services/                        # DI wiring & extension methods
        └── (ServiceCollectionExtensions.cs, ...)
```

---

## 🔵 JobHunter.Domain — Tầng Domain

**Mục đích:** Chứa các khái niệm nghiệp vụ thuần túy, không phụ thuộc vào bất kỳ framework hay thư viện nào.

**Đặt code ở đây khi:**
- Tạo một Entity mới (bảng trong database)
- Thêm thuộc tính vào Entity
- Định nghĩa Domain Event hoặc Value Object

| Folder / File | Mục đích |
|---|---|
| `BaseEntity.cs` | Base class với các audit fields: `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy` |
| `Entities/` | Mỗi file `.cs` tương ứng với một bảng/aggregate trong hệ thống |

**Ví dụ tạo Entity mới:**
```csharp
// JobHunter.Domain/Entities/Job.cs
namespace JobHunter.Domain.Entities
{
    public class Job : BaseEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Salary { get; set; }
    }
}
```

---

## 🟡 JobHunter.Service — Tầng Business & Application

**Mục đích:** Chứa toàn bộ logic nghiệp vụ, interface, DTO và cơ sở hạ tầng kỹ thuật.

### `DTOs/` — Data Transfer Objects

**Đặt code ở đây khi:** Tạo request/response model cho API, tránh expose trực tiếp Entity.

| File | Mục đích |
|---|---|
| `ResponseBase<T>` | Wrapper chuẩn hóa mọi response: `success`, `status`, `message`, `data`, `errors` |
| `PageResult<T>` | Wrapper cho danh sách có phân trang: `items`, `page`, `pageSize`, `totalCount`, `totalPage` |

**Ví dụ:**
```csharp
// JobHunter.Service/DTOs/Job/GetJobResponse.cs
namespace JobHunter.Service.DTOs.Job
{
    public class GetJobResponse
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public decimal Salary { get; set; }
    }
}
```

---

### `Constant/` — Hằng số

**Đặt code ở đây khi:** Cần định nghĩa các giá trị cố định dùng chung (string, số, enum).

```csharp
// JobHunter.Service/Constant/AppConstants.cs
namespace JobHunter.Service.Constant
{
    public static class AppConstants
    {
        public const int DefaultPageSize = 10;
        public const int MaxPageSize = 100;
    }

    public static class ErrorCodes
    {
        public const string NotFound = "NOT_FOUND";
        public const string Unauthorized = "UNAUTHORIZED";
    }
}
```

---

### `Config/` — Cấu hình Options Pattern

**Đặt code ở đây khi:** Map section từ `appsettings.json` vào class C#.

```csharp
// JobHunter.Service/Config/JwtConfig.cs
namespace JobHunter.Service.Config
{
    public class JwtConfig
    {
        public string SecretKey { get; set; }
        public int ExpirationMinutes { get; set; }
    }
}
```

---

### `Interface/` — Định nghĩa Contract (Abstractions)

**Nguyên tắc:** Luôn lập trình với interface, không lập trình với implementation cụ thể.

#### `Interface/Persistence/` — Repository Interfaces

**Đặt code ở đây khi:** Định nghĩa các thao tác đọc/ghi dữ liệu của một Entity.

```csharp
// JobHunter.Service/Interface/Persistence/IJobRepository.cs
namespace JobHunter.Service.Interface.Persistence
{
    public interface IJobRepository
    {
        Task<Job?> GetByIdAsync(Guid id);
        Task<PageResult<Job>> GetAllAsync(int page, int pageSize);
        Task AddAsync(Job job);
        Task UpdateAsync(Job job);
        Task DeleteAsync(Guid id);
    }
}
```

#### `Interface/UseCase/` — Use Case Interfaces

**Đặt code ở đây khi:** Định nghĩa một hành động nghiệp vụ cụ thể.

```csharp
// JobHunter.Service/Interface/UseCase/ICreateJobUseCase.cs
namespace JobHunter.Service.Interface.UseCase
{
    public interface ICreateJobUseCase
    {
        Task<ResponseBase<GetJobResponse>> ExecuteAsync(CreateJobRequest request);
    }
}
```

#### `Interface/Service/` — External Service Interfaces

**Đặt code ở đây khi:** Định nghĩa tích hợp với dịch vụ bên ngoài (Email, Storage, SMS...).

```csharp
// JobHunter.Service/Interface/Service/IEmailService.cs
namespace JobHunter.Service.Interface.Service
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body);
    }
}
```

---

### `Infrastructure/Persistence/` — Repository Implementations (EF Core)

**Đặt code ở đây khi:** Cài đặt cụ thể các interface Repository (truy vấn EF Core / SQL).

```csharp
// JobHunter.Service/Infrastructure/Persistence/JobRepository.cs
namespace JobHunter.Service.Infrastructure.Persistence
{
    public class JobRepository : IJobRepository
    {
        private readonly AppDbContext _context;
        public JobRepository(AppDbContext context) => _context = context;

        public async Task<Job?> GetByIdAsync(Guid id)
            => await _context.Jobs.FindAsync(id);
        // ...
    }
}
```

---

### `UseCase/` — Business Logic (Application Use Cases)

**Đặt code ở đây khi:** Cài đặt một luồng nghiệp vụ hoàn chỉnh, phối hợp Repository và Service.

```csharp
// JobHunter.Service/UseCase/CreateJobUseCase.cs
namespace JobHunter.Service.UseCase
{
    public class CreateJobUseCase : ICreateJobUseCase
    {
        private readonly IJobRepository _jobRepo;
        public CreateJobUseCase(IJobRepository jobRepo) => _jobRepo = jobRepo;

        public async Task<ResponseBase<GetJobResponse>> ExecuteAsync(CreateJobRequest request)
        {
            var job = new Job { Title = request.Title, Salary = request.Salary };
            await _jobRepo.AddAsync(job);
            return new ResponseBase<GetJobResponse>(new GetJobResponse { Id = job.Id });
        }
    }
}
```

---

### `Service/` — External Service Implementations

**Đặt code ở đây khi:** Cài đặt tích hợp thực tế với dịch vụ bên ngoài (SMTP, AWS S3, Firebase...).

```csharp
// JobHunter.Service/Service/EmailService.cs
namespace JobHunter.Service.Service
{
    public class EmailService : IEmailService
    {
        public async Task SendAsync(string to, string subject, string body)
        {
            // Gửi email qua SMTP / SendGrid...
        }
    }
}
```

---

## 🔴 JobHunter.WebAPI — Tầng Presentation

**Mục đích:** Nhận HTTP request, ủy thác xử lý cho UseCase, trả về HTTP response chuẩn.

### `Controllers/`

**Đặt code ở đây khi:** Tạo endpoint API mới.

- Kế thừa `BaseController` thay vì `ControllerBase` trực tiếp
- Inject **UseCase interface**, không inject repository hay service trực tiếp
- Không chứa business logic — chỉ gọi UseCase và trả kết quả

```csharp
// JobHunter.WebAPI/Controllers/JobController.cs
[Route("api/jobs")]
public class JobController : BaseController
{
    private readonly ICreateJobUseCase _createJobUseCase;

    public JobController(ICreateJobUseCase createJobUseCase)
        => _createJobUseCase = createJobUseCase;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateJobRequest request)
    {
        try
        {
            var result = await _createJobUseCase.ExecuteAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return HandleException(ex);
        }
    }
}
```

#### `BaseController.cs`

Cung cấp helper method `HandleException()` để trả về response lỗi chuẩn hóa. Mọi controller trong dự án **phải kế thừa** `BaseController`.

---

### `Middlewares/`

**Đặt code ở đây khi:** Cần xử lý cross-cutting concerns trên toàn bộ request pipeline (logging, auth check, rate limiting, global exception handling...).

```csharp
// JobHunter.WebAPI/Middlewares/ExceptionMiddleware.cs
public class ExceptionMiddleware : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try { await next(context); }
        catch (Exception ex) { /* ghi log, trả 500 */ }
    }
}
```

---

### `Services/` (WebAPI layer)

**Đặt code ở đây khi:** Đăng ký DI container, tạo extension method cho `IServiceCollection`.

```csharp
// JobHunter.WebAPI/Services/ServiceCollectionExtensions.cs
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Repositories
        services.AddScoped<IJobRepository, JobRepository>();

        // Use Cases
        services.AddScoped<ICreateJobUseCase, CreateJobUseCase>();

        // External Services
        services.AddScoped<IEmailService, EmailService>();

        return services;
    }
}
```

Sau đó gọi trong `Program.cs`:
```csharp
builder.Services.AddApplicationServices();
```

---

### `Program.cs`

**Đặt code ở đây khi:** Cấu hình HTTP pipeline (`app.Use...`), đăng ký middleware, cấu hình CORS, Authentication/Authorization.

---

## 🔗 Luồng phụ thuộc (Dependency Chain)

```
HTTP Request
    │
    ▼
Controller (WebAPI)
    │  inject
    ▼
IXxxUseCase → XxxUseCase (Service/UseCase)
    │  inject
    ├─► IXxxRepository → XxxRepository (Service/Infrastructure/Persistence)
    │       │ EF Core
    │       ▼
    │   Database
    │
    └─► IXxxService → XxxService (Service/Service)
            │
            ▼
        External API / SMTP / Storage
```

---

## 🧩 Packages & Dependencies

| Project | NuGet Packages |
|---|---|
| `JobHunter.Domain` | _(không có)_ — thuần .NET |
| `JobHunter.Service` | Entity Framework Core (nếu dùng EF ở đây) |
| `JobHunter.WebAPI` | `Microsoft.AspNetCore.OpenApi`, `Microsoft.EntityFrameworkCore`, `Microsoft.EntityFrameworkCore.SqlServer` |

---

## 🚀 Bắt đầu phát triển

### Thêm một tính năng mới (ví dụ: Tạo Company)

1. **Domain** — Tạo Entity:
   ```
   JobHunter.Domain/Entities/Company.cs
   ```

2. **Service/DTOs** — Tạo Request/Response DTO:
   ```
   JobHunter.Service/DTOs/Company/CreateCompanyRequest.cs
   JobHunter.Service/DTOs/Company/GetCompanyResponse.cs
   ```

3. **Service/Interface/Persistence** — Tạo Repository Interface:
   ```
   JobHunter.Service/Interface/Persistence/ICompanyRepository.cs
   ```

4. **Service/Interface/UseCase** — Tạo UseCase Interface:
   ```
   JobHunter.Service/Interface/UseCase/ICreateCompanyUseCase.cs
   ```

5. **Service/Infrastructure/Persistence** — Cài đặt Repository:
   ```
   JobHunter.Service/Infrastructure/Persistence/CompanyRepository.cs
   ```

6. **Service/UseCase** — Cài đặt Business Logic:
   ```
   JobHunter.Service/UseCase/CreateCompanyUseCase.cs
   ```

7. **WebAPI/Controllers** — Tạo Controller:
   ```
   JobHunter.WebAPI/Controllers/CompanyController.cs
   ```

8. **WebAPI/Services** — Đăng ký DI:
   ```csharp
   services.AddScoped<ICompanyRepository, CompanyRepository>();
   services.AddScoped<ICreateCompanyUseCase, CreateCompanyUseCase>();
   ```

---

## 📋 Checklist kiến trúc

- [ ] Entity mới → `JobHunter.Domain/Entities/`
- [ ] DTO mới → `JobHunter.Service/DTOs/{Feature}/`
- [ ] Repository Interface → `JobHunter.Service/Interface/Persistence/`
- [ ] UseCase Interface → `JobHunter.Service/Interface/UseCase/`
- [ ] External Service Interface → `JobHunter.Service/Interface/Service/`
- [ ] Repository Implementation → `JobHunter.Service/Infrastructure/Persistence/`
- [ ] UseCase Implementation → `JobHunter.Service/UseCase/`
- [ ] External Service Implementation → `JobHunter.Service/Service/`
- [ ] Controller → `JobHunter.WebAPI/Controllers/` (kế thừa `BaseController`)
- [ ] Middleware → `JobHunter.WebAPI/Middlewares/`
- [ ] DI Registration → `JobHunter.WebAPI/Services/ServiceCollectionExtensions.cs`
