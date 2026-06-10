# API Design: Get Application Detail

## Endpoint

```
GET /api/hr/applications/{applicationId}
```

## Authorization

- Role: `HR`
- The HR user must own the job that the application belongs to (via `companyId`)

## Path Parameter

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `applicationId` | `Guid` | ID of the application |

## Response

### Success `200 OK`

```json
{
  "status": "SUCCESS",
  "data": {
    "applicationId": "uuid",
    "candidateName": "string",
    "phone": "string | null",
    "email": "string",
    "matchScore": 0.95,
    "aiSuggestion": "string | null",
    "coverLetter": "string | null",
    "status": "Pending | Rejected | Accepted",
    "fileUrl": "string | null"
  }
}
```

### Error Responses

| HTTP Code | Condition |
| :--- | :--- |
| `404 NOT_FOUND` | `applicationId` does not exist |
| `403 FORBIDDEN` | HR does not own the job this application belongs to |
| `401 UNAUTHORIZED` | No valid JWT token |

---

## Implementation Plan

### 1. DTO
**File:** `JobHunter.Service/DTOs/HR/ApplicationDetailDto.cs`

```csharp
public class ApplicationDetailDto
{
    [JsonPropertyName("applicationId")]
    public Guid ApplicationId { get; set; }

    [JsonPropertyName("candidateName")]
    public string? CandidateName { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("matchScore")]
    public decimal? MatchScore { get; set; }

    [JsonPropertyName("aiSuggestion")]
    public string? AiSuggestion { get; set; }

    [JsonPropertyName("coverLetter")]
    public string? CoverLetter { get; set; }

    [JsonPropertyName("status")]
    public string? Status { get; set; }

    [JsonPropertyName("fileUrl")]
    public string? FileUrl { get; set; }
}
```

---

### 2. Repository Interface
**File:** `JobHunter.Service/Interface/Persistence/IApplicationRepository.cs`

Add method:
```csharp
Task<ApplicationDetailDto?> GetApplicationDetail(Guid applicationId);
```

---

### 3. Repository Implementation
**File:** `JobHunter.Service/Infrastructure/Persistence/ApplicationRepository.cs`

```csharp
public Task<ApplicationDetailDto?> GetApplicationDetail(Guid applicationId)
{
    return _context.Applications
        .Where(a => a.Id == applicationId)
        .Select(a => new ApplicationDetailDto
        {
            ApplicationId = a.Id,
            CandidateName = a.Resume != null ? a.Resume.User.Name : null,
            Phone = a.Resume != null ? a.Resume.User.Phone : null,
            Email = a.Resume != null ? a.Resume.User.Email : null,
            MatchScore = a.MatchScore,
            AiSuggestion = a.AiSuggestion,
            CoverLetter = a.CoverLetter,
            Status = a.Status != null ? a.Status.Value.ToString() : null,
            FileUrl = a.Resume != null ? a.Resume.FileUrl : null
        })
        .FirstOrDefaultAsync();
}
```

---

### 4. Use Case Interface
**File:** `JobHunter.Service/Interface/UseCase/IHRDashboardUseCase.cs`

Add method:
```csharp
Task<ApplicationDetailDto> GetApplicationDetail(Guid userId, Guid applicationId);
```

---

### 5. Use Case Implementation
**File:** `JobHunter.Service/UseCase/HRDashboardUseCase.cs`

```csharp
public async Task<ApplicationDetailDto> GetApplicationDetail(Guid userId, Guid applicationId)
{
    var user = await _userRepository.GetUserById(userId);
    if (user == null)
        throw new KeyNotFoundException("Không tìm thấy người dùng");
    if (user.CompanyId == null)
        throw new UnauthorizedAccessException("Tài khoản HR chưa được liên kết với công ty");

    var application = await _applicationRepository.GetApplicationDetail(applicationId);
    if (application == null)
        throw new KeyNotFoundException("Không tìm thấy đơn ứng tuyển");

    var isOwned = await _jobRepository.IsJobOwnedByCompany(application.JobId, user.CompanyId.Value);
    if (!isOwned)
        throw new KeyNotFoundException("Không tìm thấy đơn ứng tuyển");

    return application;
}
```

> **Note:** `ApplicationDetailDto` needs a non-serialized `JobId` field used internally for the ownership check, or ownership can be verified via a separate repository call using `applicationId` directly.

**Alternative (simpler):** Add `GetJobIdByApplication(Guid applicationId)` to `IApplicationRepository` and verify ownership before fetching the detail.

---

### 6. Controller Endpoint
**File:** `JobHunter.WebAPI/Controllers/HRController.cs`

```csharp
[HttpGet("applications/{applicationId:guid}")]
public async Task<ActionResult<ResponseBase<ApplicationDetailDto>>> GetApplicationDetail(Guid applicationId)
{
    var userId = User.GetUserId();
    var result = await _hrDashboardUseCase.GetApplicationDetail(userId, applicationId);
    return new ResponseBase<ApplicationDetailDto>(result);
}
```

---

## Data Flow

```
GET /api/hr/applications/{applicationId}
    |
    v
HRController.GetApplicationDetail(applicationId)
    | calls
    v
IHRDashboardUseCase.GetApplicationDetail(userId, applicationId)
    | uses
    |-- IUserRepository.GetUserById(userId)             -> validate HR + companyId
    |-- IJobRepository.IsJobOwnedByCompany(...)         -> ownership check
    |-- IApplicationRepository.GetApplicationDetail(applicationId)
    |       -> applications JOIN resumes JOIN users
    v
ApplicationDetailDto
    |
    v
ResponseBase<ApplicationDetailDto> -> 200 OK
```

---

## EF Core Join

The query joins three tables:

```
applications -> resumes -> users
```

Fields sourced per table:

| Field | Source |
| :--- | :--- |
| `applicationId` | `applications.id` |
| `matchScore` | `applications.match_score` |
| `aiSuggestion` | `applications.ai_suggestion` |
| `coverLetter` | `applications.cover_letter` |
| `status` | `applications.status` |
| `fileUrl` | `resumes.file_url` |
| `candidateName` | `users.name` |
| `phone` | `users.phone` |
| `email` | `users.email` |
