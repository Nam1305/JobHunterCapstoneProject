# PR APIs

API design for the first user homepage:

- `frontend/src/app/(user)/page.tsx`
- FE types: `frontend/src/types/company.ts`, `frontend/src/types/job.ts`

Only return fields the FE needs.

## GET /api/companies/top

Return top companies for the homepage carousel.

### Query

| Name    | Type  | Default |
| ------- | ----- | ------- |
| `limit` | `int` | `10`    |

### Response

```ts
type CompanyCard = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  coverPhotoUrl: string | null;
  companyType: string | null;
  teamSize: string | null;
  country: string | null;
  openingVacancies: number;
  numberOfFollowers: number;
};
```

```json
{
  "success": true,
  "status": 200,
  "message": "Success.",
  "errorCode": null,
  "data": [
    {
      "id": "b5a52a2f-7aa5-4d58-84b9-6b4b05abca61",
      "name": "FPT Software",
      "slug": "fpt-software",
      "logoUrl": null,
      "coverPhotoUrl": null,
      "companyType": "Technology",
      "teamSize": "1000+",
      "country": "Vietnam",
      "openingVacancies": 127,
      "numberOfFollowers": 0
    }
  ]
}
```

## GET /api/jobs/top

Return top jobs for the homepage grid.

### Query

| Name    | Type  | Default |
| ------- | ----- | ------- |
| `limit` | `int` | `9`     |

### Response

```ts
type JobCard = {
  id: string;
  title: string | null;
  companyName: string;
  companyImage: string | null;
  salaryRange: string | null;
  experienceRequirement: string | null;
  workType: "Onsite" | "Remote" | "Hybrid" | "Oversea" | null;
  expiredAt: string | null;
  tags: string[];
  slug: string;
  city: string;
  jobLevels: string[];
};
```

```json
{
  "success": true,
  "status": 200,
  "message": "Success.",
  "errorCode": null,
  "data": [
    {
      "id": "8fb4f462-8c3e-43fd-a75c-2c95e1e81668",
      "title": "Senior Frontend Developer",
      "companyName": "FPT Software",
      "companyImage": null,
      "salaryRange": "25 - 40 triệu",
      "experienceRequirement": "5 năm",
      "workType": "Onsite",
      "expiredAt": "2026-07-05T17:00:00+07:00",
      "tags": ["ReactJS", "TypeScript"],
      "slug": "senior-frontend-developer",
      "city": "Hà Nội",
      "jobLevels": ["Trưởng phòng"]
    }
  ]
}
```

## GET /api/jobs

Return jobs for `frontend/src/app/(user)/cong-viec/page.tsx`.

### Query

| Name               | Type       | Default |
| ------------------ | ---------- | ------- |
| `search`           | `string`   | `null`  |
| `location`         | `string`   | `null`  |
| `companySlug`      | `string`   | `null`  |
| `categorySlugs`    | `string[]` | `[]`    |
| `subcategorySlugs` | `string[]` | `[]`    |
| `levelSlugs`       | `string[]` | `[]`    |
| `workTypes`        | `string[]` | `[]`    |
| `page`             | `int`      | `1`     |
| `pageSize`         | `int`      | `5`     |

Example:

```text
GET /api/jobs?search=developer&location=Hà Nội&companySlug=viettel-solutions&subcategorySlugs=software-developer&levelSlugs=senior&workTypes=Remote&page=1&pageSize=5
```

### Response

```ts
type CompanyBranchResponse = {
  id: string;
  companyId: string;
  name: string | null;
  address: string | null;
  city: string | null;
  citySlug: string | null;
};

type JobDetails = {
  id: string;
  title: string | null;
  companyName: string;
  companyImage: string | null;
  salaryRange: string | null;
  experienceRequirement: string | null;
  workType: "Onsite" | "Remote" | "Hybrid" | "Oversea" | null;
  expiredAt: string | null;
  tags: string[];
  slug: string;
  city: string;
  jobLevels: string[];
  companyId: string;
  branchId: string | null;
  subcategoryId: string | null;
  applicants: number;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  branch: CompanyBranchResponse | null;
};
```

```json
{
  "success": true,
  "status": 200,
  "message": "Success.",
  "errorCode": null,
  "data": {
    "items": [
      {
        "id": "7d49dc16-cf59-4bb0-90f3-6b0d558cb61e",
        "companyId": "0935c729-42a3-4a58-9558-543d514386c9",
        "branchId": "34f7a76a-f881-47ed-9f14-8f7791208d0e",
        "subcategoryId": null,
        "title": "Chuyên viên Phân tích nghiệp vụ (BA)",
        "companyName": "Công ty Dịch vụ Số Bưu điện (Vietnam Post Digital)",
        "companyImage": null,
        "salaryRange": "12.000.000 VND to 25.000.000 VND",
        "experienceRequirement": "Junior",
        "workType": "Onsite",
        "expiredAt": "2026-06-30T17:00:00+07:00",
        "tags": ["Business Analyst"],
        "slug": "chuyen-vien-phan-tich-nghiep-vu-ba",
        "city": "Hà Nội",
        "jobLevels": ["Junior"],
        "applicants": 24,
        "responsibilities": "Xây dựng quy trình nghiệp vụ...",
        "requirements": "Yêu cầu từ 1 năm kinh nghiệm làm IT BA...",
        "benefits": "Thu nhập: 12.000.000 VNĐ - 25.000.000 VNĐ.",
        "branch": {
          "id": "34f7a76a-f881-47ed-9f14-8f7791208d0e",
          "companyId": "0935c729-42a3-4a58-9558-543d514386c9",
          "name": "Công ty Dịch vụ Số Bưu điện (Vietnam Post Digital)",
          "address": "Quận Nam Từ Liêm, Hà Nội",
          "city": "Hà Nội",
          "citySlug": "ha-noi"
        }
      }
    ],
    "page": 1,
    "pageSize": 5,
    "totalCount": 24,
    "totalPage": 5
  }
}
```

## GET /api/jobs/{slug}

Return one job detail by slug for:

- `frontend/src/app/(user)/cong-viec/page.tsx`
- `frontend/src/app/(user)/cong-viec/[slug]/page.tsx`

### Response

```ts
type JobDetails = {
  id: string;
  title: string | null;
  companyName: string;
  companyImage: string | null;
  salaryRange: string | null;
  experienceRequirement: string | null;
  workType: "Onsite" | "Remote" | "Hybrid" | "Oversea" | null;
  expiredAt: string | null;
  tags: string[];
  slug: string;
  city: string;
  jobLevels: string[];
  companyId: string;
  branchId: string | null;
  subcategoryId: string | null;
  applicants: number;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  branch: CompanyBranchResponse | null;
};
```

```json
{
  "success": true,
  "status": 200,
  "message": "Success.",
  "errorCode": null,
  "data": {
    "id": "5a5f1e2b-49cb-4f14-a6c9-8d49c8f994a0",
    "companyId": "fedf1fc7-1765-4df9-a39c-ef34c070054d",
    "branchId": "0f7a5db5-a75d-44a6-b167-fdc5c8b8d826",
    "subcategoryId": null,
    "title": "Content Marketing",
    "companyName": "DaouKiwoom Innovation",
    "companyImage": null,
    "salaryRange": "9.000.000 VND - 13.000.000 VND",
    "experienceRequirement": "1 năm, 3 năm",
    "workType": "Hybrid",
    "expiredAt": "2026-06-14T17:00:00+07:00",
    "tags": ["Viết nội dung", "SEO", "Canva"],
    "slug": "content-marketing",
    "city": "Hồ Chí Minh",
    "jobLevels": ["Junior", "Middle", "Senior"],
    "applicants": 58,
    "responsibilities": "Lập kế hoạch, xây dựng và quản lý lịch nội dung...",
    "requirements": "Có 1-3 năm kinh nghiệm trong tiếp thị nội dung...",
    "benefits": "Mức lương cạnh tranh cùng thưởng hiệu suất theo quý.",
    "branch": {
      "id": "0f7a5db5-a75d-44a6-b167-fdc5c8b8d826",
      "companyId": "fedf1fc7-1765-4df9-a39c-ef34c070054d",
      "name": "DaouKiwoom Innovation",
      "address": "Quận Bình Thạnh, Hồ Chí Minh",
      "city": "Hồ Chí Minh",
      "citySlug": "ho-chi-minh"
    }
  }
}
```

## GET /api/jobs/filter-options

Return filter options for `frontend/src/app/(user)/cong-viec/page.tsx`.

### Response

```ts
type JobFilterOptions = {
  categories: {
    name: string;
    slug: string;
    subcategories: {
      name: string;
      slug: string;
    }[];
  }[];
  levels: {
    name: string;
    slug: string;
  }[];
  workTypes: ("Onsite" | "Remote" | "Hybrid" | "Oversea")[];
  locations: string[];
};
```

```json
{
  "success": true,
  "status": 200,
  "message": "Success.",
  "errorCode": null,
  "data": {
    "categories": [
      {
        "name": "IT",
        "slug": "it",
        "subcategories": [
          { "name": "IT Support Specialist", "slug": "it-support-specialist" },
          {
            "name": "Product Manager / Business Analyst",
            "slug": "product-manager-business-analyst"
          },
          { "name": "QA / Tester", "slug": "qa-tester" },
          {
            "name": "Network Engineer / Cyber Security Expert",
            "slug": "network-engineer-cyber-security-expert"
          },
          {
            "name": "Data Engineer / Scientist / Analyst",
            "slug": "data-engineer-scientist-analyst"
          },
          { "name": "DevOps Engineer", "slug": "devops-engineer" },
          { "name": "Blockchain Developer", "slug": "blockchain-developer" },
          {
            "name": "Internet of Things (IoT) Developer",
            "slug": "internet-of-things-iot-developer"
          },
          {
            "name": "Augmented Reality (AR) Developer",
            "slug": "augmented-reality-ar-developer"
          },
          {
            "name": "Machine Learning / AI Engineer",
            "slug": "machine-learning-ai-engineer"
          },
          { "name": "Software Developer", "slug": "software-developer" }
        ]
      }
    ],
    "levels": [
      { "name": "Director", "slug": "director" },
      { "name": "Vice Director", "slug": "vice-director" },
      { "name": "Intern", "slug": "intern" },
      { "name": "Fresher", "slug": "fresher" },
      { "name": "Junior", "slug": "junior" },
      { "name": "Middle", "slug": "middle" },
      { "name": "Senior", "slug": "senior" },
      { "name": "Trưởng Nhóm", "slug": "truong-nhom" },
      { "name": "Trưởng phòng", "slug": "truong-phong" }
    ],
    "workTypes": ["Onsite", "Hybrid", "Remote", "Oversea"],
    "locations": ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Remote"]
  }
}
```

## GET /api/companies

Return companies for `frontend/src/app/(user)/cong-ty/page.tsx`.

### Query

| Name       | Type     | Default |
| ---------- | -------- | ------- |
| `search`   | `string` | `null`  |
| `page`     | `int`    | `1`     |
| `pageSize` | `int`    | `9`     |

Example:

```text
GET /api/companies?search=viettel&page=1&pageSize=9
```

### Response

```ts
type CompanyCard = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  coverPhotoUrl: string | null;
  companyType: string | null;
  teamSize: string | null;
  country: string | null;
  openingVacancies: number;
  numberOfFollowers: number;
};
```

```json
{
  "success": true,
  "status": 200,
  "message": "Success.",
  "errorCode": null,
  "data": {
    "items": [
      {
        "id": "aa30a12f-2994-4140-8556-bc07009dad9d",
        "name": "Viettel Solutions",
        "slug": "viettel-solutions",
        "logoUrl": null,
        "coverPhotoUrl": null,
        "companyType": "Information Technology",
        "teamSize": "1000+ nhân sự",
        "country": "Vietnam",
        "openingVacancies": 3,
        "numberOfFollowers": 122
      }
    ],
    "page": 1,
    "pageSize": 9,
    "totalCount": 17,
    "totalPage": 2
  }
}
```
