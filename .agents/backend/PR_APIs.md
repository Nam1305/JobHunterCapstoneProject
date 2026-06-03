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
