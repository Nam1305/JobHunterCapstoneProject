# HR Dashboard API Documentation

Tài liệu này mô tả các API dành cho giao diện Dashboard của HR.

## 1. Get List Jobs
Lấy danh sách các công việc đã đăng của công ty mà HR đang quản lý. Trả về tiêu đề và số lượng ứng viên đã ứng tuyển.

- **Endpoint:** `GET /api/hr/jobs`
- **Authentication:** Required (Role: HR)
- **Query Parameters:**
    - `page` (int): Số trang hiện tại (mặc định: 1)
    - `pageSize` (int): Số lượng mục trên mỗi trang (mặc định: 10)
    - `search` (string): Tìm kiếm theo tiêu đề công việc
    - `status` (string): Lọc theo trạng thái (`Active` - còn hạn, `Expired` - hết hạn, `All` - tất cả)
- **Response:** `ResponseBase<PageResult<JobItemDto>>`
    - `200 OK`: Trả về danh sách công việc.
    ```json
    {
      "success": true,
      "status": 200,
      "message": "Success.",
      "data": {
        "items": [
          {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "title": "Senior .NET Developer",
            "applicationCount": 12
          }
        ],
        "page": 1,
        "pageSize": 10,
        "totalCount": 50,
        "totalPage": 5
      }
    }
    ```

## 2. Get Candidates by Job
Lấy danh sách các ứng viên đã ứng tuyển vào một công việc cụ thể.

- **Endpoint:** `GET /api/hr/jobs/{jobId}/candidates`
- **Authentication:** Required (Role: HR)
- **Path Parameters:**
    - `jobId` (Guid): ID của công việc cần lấy danh sách ứng viên
- **Query Parameters:**
    - `page` (int): Số trang hiện tại (mặc định: 1)
    - `pageSize` (int): Số lượng mục trên mỗi trang (mặc định: 10)
    - `status` (string): Lọc theo trạng thái hồ sơ (`Pending`, `Reviewed`, `Shortlisted`, `Rejected`, `Accepted`)
- **Response:** `ResponseBase<PageResult<CandidateDto>>`
    - `200 OK`: Trả về danh sách ứng viên đã apply.
    ```json
    {
      "success": true,
      "status": 200,
      "message": "Success.",
      "data": {
        "items": [
          {
            "applicationId": "4da95f64-5717-4562-b3fc-2c963f66afa6",
            "candidateId": "5ea95f64-5717-4562-b3fc-2c963f66afa6",
            "candidateName": "Nguyễn Văn A",
            "email": "vana@example.com",
            "phone": "0987654321",
            "resumeUrl": "https://storage.jobhunter.com/resumes/vana-cv.pdf",
            "appliedAt": "2024-06-05T14:30:00Z",
            "status": "Pending",
            "matchScore": 88.5
          }
        ],
        "page": 1,
        "pageSize": 10,
        "totalCount": 12,
        "totalPage": 2
      }
    }
    ```
