# JobHunter - System Overview

This document provides a comprehensive high-level and detailed architectural overview of the **JobHunter** system. It is designed to keep development team members and AI coding agents aligned on the system goals, roles, directory structures, and code architecture guidelines.

---

## 🎯 System Goal
JobHunter is an AI-powered job board and recruitment platform. Its primary goal is to streamline the recruitment process by matching recruiters with qualified candidates using automated resume filtering (AI CV screening), interactive real-time communication (Chat), and structured job search capabilities.

---

## 👥 User Roles & Features

The system supports three main user roles, each accessing a tailored set of features:

### 1. 👑 Admin (System Administrator)
* **Goal**: Maintain the health, security, and integrity of the platform.
* **Key Features**:
  - **User Management**: View, block/unblock, edit roles, or delete users (Admin, HR, Candidate).
  - **Audit Logs / Monitoring**: Monitor platform activity and audit system usage (future).

### 2. 💼 HR / Recruiter (Recruitment Portal)
* **Goal**: Discover talent quickly and manage recruitment workflows efficiently.
* **Key Features**:
  - **Job Posting (JD Management)**: Create, read, update, and delete (CRUD) Job Descriptions. Specify job requirements, salary range, locations, and skills.
  - **Company Profile Management**: Edit company details, upload company logo, size, industry, and description.
  - **AI CV Screener / CV Finder**:
    - Upload candidate CVs.
    - Leverage AI-powered CV processing to automatically extract skills, experience, and match/rank CVs against active Job Descriptions.
  - **Communication (Chat)**: Initiate and participate in direct real-time chat with Candidates who have applied to their JDs.

### 3. 🎓 Candidate (Job Seeker Portal)
* **Goal**: Find relevant jobs, showcase professional profiles, and connect with potential employers.
* **Key Features**:
  - **Job Search & Browsing**: Search for jobs by keywords, locations, categories, and salary ranges. Filter and sort results.
  - **Profile & CV Management**: Upload and manage multiple CVs (PDF, Word formats). Maintain profile information.
  - **Job Application**: Apply to jobs by selecting a CV and submitting applications.
  - **Communication (Chat)**: Receive messages and chat with HR recruiters regarding applications.

---

## 📐 Architecture & Coding Guidelines (AI-Agent Friendly)

To keep code clean and maintainable, both human developers and AI agents **MUST** strictly follow the established 3-layer architecture.

```
┌────────────────────────────────────┐
│          JobHunter.WebAPI          │  ← Presentation Layer (REST Endpoints)
│  Controllers, Middlewares, Config  │
└────────────────┬───────────────────┘
                 │ references
                 ▼
┌────────────────────────────────────┐
│         JobHunter.Service          │  ← Application Layer (Business Logic & Infrastructure)
│  UseCases, Services, Interfaces,   │
│  DTOs, Infrastructure, Constants   │
└────────────────┬───────────────────┘
                 │ references
                 ▼
┌────────────────────────────────────┐
│          JobHunter.Domain          │  ← Domain Layer (Core Entities & Enums)
│       Entities, BaseEntity         │
└────────────────────────────────────┘
```

### Layer Rules
1. **Domain Layer (`JobHunter.Domain`)**:
   - Contains pure C# domain entities (e.g. `User`, `Job`, `CV`, `Application`, `Company`) and enums (e.g. `UserRole`).
   - Zero dependencies on databases, ORMs, or third-party web packages.
   - BaseEntity provides default tracking properties (`Id`, `CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`).
2. **Application Layer (`JobHunter.Service`)**:
   - Houses the core business logic using the **Use Case** pattern (e.g. `CreateJobUseCase`).
   - Declares abstractions (`Interface/Persistence` and `Interface/Service`).
   - Houses infrastructure implementation such as EF Core Repositories (`Infrastructure/Persistence`) and external service integration (`Service/` - email, file storage, AI processing).
3. **Presentation Layer (`JobHunter.WebAPI`)**:
   - Contains REST controllers (`Controllers/`), middleware (`Middlewares/`), configurations (`appsettings.json`), and DI registrations (`Services/ServiceCollectionExtensions.cs`).
   - Controllers must inject **Use Cases** (e.g., `ICreateJobUseCase`), not repositories or database contexts directly.

---

## 🛠 Tech Stack Overview

### 🖥 Backend
- **Framework**: `.NET 10`
- **Database Access**: Entity Framework Core (SQL Server / PostgreSQL)
- **API Patterns**: RESTful API, Controller-based routing, JWT Authentication

### 🌐 Frontend
- **Framework**: `Next.js 16` (React 19, TypeScript)
- **Styling**: `Tailwind CSS v4`
- **Components**: Shadcn UI, Radix UI primitives, Lucide Icons, Sonner toasts
- **Utilities**: TanStack Table, Recharts, DnD Kit (Drag & Drop)

---

## 📝 Roadmap & Future Features
- Full integration of AI parsing services (e.g., OpenAI/Gemini or custom NLP model to parse PDF CVs).
- Real-time chat pipeline (using WebSockets/SignalR).
- Comprehensive dashboard reporting for HR & Admin.
