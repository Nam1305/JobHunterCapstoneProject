export interface JobPosting {
  id: string;
  title: string;
  createdAt: string;
  expiredAt: string;
  updatedAt: string;
  status: "Open" | "Closed";
  applicationCount: number;
}

export interface JobPostDetail {
  Name: string;
  SalaryRange: string;
  JobWorkType: string;
  ExperiedDate: string; // Lưu ý: Backend đang viết sai chính tả từ "Expired"
  category: string; // GUID
  subCategory: string; // GUID
  branch: string;
  experienceLevels: string[]; // Mảng các ID
  ExperienceRequirement: string;
  tags: string;
  Responsibilities: string;
  Requirements: string;
  Benefits: string;
}