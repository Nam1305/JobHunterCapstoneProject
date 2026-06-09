# Technical Design Specification

*[Project Name] ([CODE]) - Report 4*

| Project Name | CareerHub |
| --- | --- |
| Architecture Style | Monolith |
| SRS Reference | SRS v1.0.0 |
| Screen Design Ref | ScreenDesignSpec v1.0.0 |
| TDS Version | v1.0.0 |
| Date Created | 09/06/2026 |
| Last Updated | 09/06/2026 |
| Author(s) | QuocDK |
| Reviewer(s) | NamPH, KienLTT |
| Status | Draft |

# How to Use This Template

> **Template conventions**
> Colour-coded guidance blocks:
> BLUE box = Guidance — explains what to write in this section
> TEAL box = ARCH — what changes per architecture style
> RED box = REQUIRED — must not be skipped regardless of architecture
> GREEN box = Example — illustrative content; replace with your own
> PURPLE box = Diagram placeholder — insert diagram here
> BROWN box = Code / DDL / pseudocode block
> GRAY box = Reference to companion document
> Workflow:
> 1. Fill Parts 1–3 before Sprint 1 coding begins
> 2. Fill Parts 4–6 rolling — one section per feature sprint
> 3. Parts 7–9 once during Sprint 0, refine as project progresses
> 4. DELETE all guidance boxes before distributing the completed TDS
> Companion documents (do not duplicate content from these):
> SRS v[X.X] — WHAT the system must do
> UI/UX Specification v[X.X] — HOW it looks and how users interact
> [ProjectName]_RTW.xlsx — BR Register, NFR Tracker, Traceability
> OpenAPI/Swagger file — machine-readable REST API contract

# Document Change History

| Version | Date | Changes | Author |
| --- | --- | --- | --- |
| v1.0.0 | 09/06/2026 | Initial TDS baseline | QuocDK |

# Part 1 — System Architecture

Part 1 defines the structural foundation for CareerHub: the architecture style, runtime components, source-code boundaries, technology stack, and deployment approach.

## 1.1 Architecture Overview & Decision Rationale

Architecture Style: Layered Monolith with separated frontend and backend applications

CareerHub uses a layered monolith backend with a separate Next.js frontend. The backend is an ASP.NET Core REST API split into `JobHunter.WebAPI`, `JobHunter.Service`, and `JobHunter.Domain`; the frontend communicates with it through JSON REST APIs.

This architecture is chosen because the project has a small team, limited timeline, and closely related recruitment workflows. It keeps development and deployment simple while preserving clear boundaries between presentation, business logic, data access, and domain model.

JWT authentication, role-based authorization, PostgreSQL, and EF Core support the main security and data integrity needs. Future integrations such as AI CV screening, file storage, and chat can be added behind service interfaces without changing the core architecture.


| Decision | Choice | Rationale | NFR / Constraint Driving It |
| --- | --- | --- | --- |
| Architecture style | Layered Monolith | Simpler development, testing, deployment, and debugging for a small team while preserving clear layer boundaries. | NFR-MNT-01 Maintainability; project timeline constraint |
| Backend platform | ASP.NET Core Web API on .NET 10 | Matches existing repository implementation; supports REST controllers, middleware, DI, JWT auth, OpenAPI, and EF Core. | Team technology choice; NFR-MNT-01 Maintainability |
| Frontend platform | Next.js 16 with React 19 and TypeScript | Provides a modern web UI, route-based structure, reusable components, and strong typing. | NFR-USAB-01 Usability; NFR-MNT-01 Maintainability |
| Database type | PostgreSQL | Relational model with ACID transactions for users, jobs, companies, refresh tokens, and future recruitment records. | NFR-DATA-01 Data integrity; NFR-REL-01 Reliability |
| ORM / persistence | Entity Framework Core with Npgsql | Reduces data-access boilerplate, supports migrations, and keeps repository implementations consistent. | NFR-MNT-01 Maintainability; NFR-DATA-01 Data integrity |
| Auth approach | JWT access token with refresh token stored by backend | Supports REST API authentication, role-based access, and future frontend/mobile clients. | NFR-SEC-01 Authentication and authorization |
| File storage | S3-compatible object storage | Supports company logos, CV files, and future uploaded media outside the relational database. | NFR-SCAL-01 Storage scalability |
| API documentation | Swagger/OpenAPI | Provides discoverable API contracts for frontend and backend collaboration. | Development constraint; NFR-MNT-01 Maintainability |

## 1.2 System / Component Diagram

> **Diagram required — skipped as requested**
> Component diagram should be created in draw.io as `CareerHub_ComponentDiagram.drawio`, exported to PNG, and embedded here.
> Required content: Browser / Next.js frontend, ASP.NET Core Web API, PostgreSQL database, S3-compatible storage, Google OAuth service, and communication protocols.

| Component | Type | Responsibility | Technology |
| --- | --- | --- | --- |
| Web Browser | Client | Runs the CareerHub web UI and stores authentication cookies/tokens according to frontend behavior. | Modern browser |
| Frontend Web App | UI | Provides Candidate, HR, and Admin screens; calls backend REST APIs; manages client state and server state. | Next.js 16, React 19, TypeScript, Axios, TanStack Query, Redux Toolkit |
| Backend API | Service | Exposes REST endpoints for authentication, users, jobs, companies, and future recruitment workflows. | ASP.NET Core Web API, .NET 10 |
| Authentication Module | Service | Validates login/register requests, Google login, JWT access tokens, refresh tokens, and user roles. | ASP.NET Core Authentication JwtBearer, BCrypt.Net |
| Application Use Cases | Service | Implements business workflows and coordinates repositories, DTOs, and external services. | C# use case classes in `JobHunter.Service` |
| Persistence Layer | Service | Provides repository abstractions and EF Core repository implementations. | Entity Framework Core 10, Npgsql |
| Primary Database | DB | Stores users, refresh tokens, companies, branches, jobs, job categories, job subcategories, and job levels. | PostgreSQL |
| Object Storage | External | Stores uploaded assets such as company logos, CV files, and future recruitment documents. | S3-compatible storage using AWSSDK.S3 |
| Google OAuth Service | External | Verifies Google login identity information for supported authentication flow. | Google OAuth client integration via HTTP |
| Swagger / OpenAPI UI | Developer Tool | Documents and tests backend REST APIs during development and review. | Swashbuckle.AspNetCore, Microsoft.AspNetCore.OpenApi |

## 1.3 Package / Module Diagram

> **Diagram required — skipped as requested**
> Package/module diagram should be created in draw.io as `CareerHub_PackageDiagram.drawio` and embedded here.
> Required dependency direction: `JobHunter.WebAPI` -> `JobHunter.Service` -> `JobHunter.Domain`; frontend calls backend only through HTTP APIs.

Backend source-code dependency rule:

```text
Allowed:
JobHunter.WebAPI -> JobHunter.Service -> JobHunter.Domain

Not allowed:
JobHunter.Domain -> JobHunter.Service
JobHunter.Domain -> JobHunter.WebAPI
JobHunter.Service -> JobHunter.WebAPI
Circular dependencies between layers
```

| Package / Module | Layer | Responsibility | Allowed Dependencies |
| --- | --- | --- | --- |
| `frontend/src/app` | Frontend Routing | Defines Next.js app routes and layouts for Candidate, HR, and Admin areas. | Frontend components, providers, API modules |
| `frontend/src/components` | Frontend UI | Contains reusable UI, dashboard, auth, user, and HR components. | Frontend hooks, store, types, utilities |
| `frontend/src/api` | Frontend API Client | Centralizes HTTP client setup and API functions for auth and user operations. | Axios, frontend types |
| `frontend/src/store` | Frontend State | Manages client-side auth and modal state. | Redux Toolkit |
| `frontend/src/providers` | Frontend Composition | Provides Redux store, React Query, and theme context to the app. | Store, QueryClient, theme provider |
| `frontend/src/types` | Frontend Types | Defines TypeScript data contracts for auth, user, job, company, and base responses. | None except TypeScript |
| `JobHunter.WebAPI/Controllers` | Presentation | Handles HTTP requests, validates routing concerns, calls use case interfaces, and returns HTTP responses. | `JobHunter.Service` interfaces and DTOs only |
| `JobHunter.WebAPI/Middlewares` | Presentation / Cross-cutting | Handles HTTP pipeline behavior such as global exception handling. | ASP.NET Core middleware APIs; service DTOs if needed |
| `JobHunter.WebAPI/Program.cs` | Application Startup | Registers controllers, CORS, JWT auth, EF Core, DI, Swagger, middleware, and route mapping. | `JobHunter.Service`, ASP.NET Core |
| `JobHunter.Service/Interface/UseCase` | Application Contract | Defines use case interfaces consumed by controllers. | DTOs, domain types when needed |
| `JobHunter.Service/UseCase` | Business Logic | Implements application workflows for auth, users, jobs, and companies. | Repositories, services, DTOs, domain entities |
| `JobHunter.Service/Interface/Persistence` | Persistence Contract | Defines repository interfaces for data access. | Domain entities, DTOs when needed |
| `JobHunter.Service/Infrastructure/Persistence` | Data Access | Contains EF Core `JobhunterContext`, migrations, and repository implementations. | EF Core, Npgsql, domain entities |
| `JobHunter.Service/Interface/Service` | External Service Contract | Defines external integration contracts such as Google auth and file storage. | DTOs or simple request/response models |
| `JobHunter.Service/Service` | External Integration | Implements Google auth verification and S3-compatible file storage. | HTTP client, AWSSDK.S3, DTOs |
| `JobHunter.Service/DTOs` | Application Contract | Contains request/response DTOs and shared response wrappers. | Simple types and domain-safe projections |
| `JobHunter.Service/Config` | Configuration / DI | Registers repositories, use cases, JWT auth, CORS, S3 client, and application services. | ASP.NET Core DI, configuration, service implementations |
| `JobHunter.Service/Utils` | Shared Application Helpers | Provides focused helpers for password hashing, claims, token cookies, and slug generation. | Framework or package APIs required by each helper |
| `JobHunter.Domain/Entities` | Domain Model | Defines persisted domain entities such as `User`, `RefreshToken`, `Company`, `CompanyBranch`, `Job`, `JobCategory`, `JobSubcategory`, and `JobLevel`. | None |
| `JobHunter.Domain/Enums` | Domain Model | Defines domain enum values such as user roles and job work types. | None |

## 1.4 Technology Stack

| Layer | Technology | Version | Justification |
| --- | --- | --- | --- |
| Backend Language / Runtime | C# / .NET | .NET 10 (`net10.0`) | Existing backend targets .NET 10; provides modern C# support, DI, middleware, and web API hosting. |
| Backend Web Framework | ASP.NET Core Web API | 10.0.8 packages | Controller-based REST API with middleware pipeline, authentication, authorization, CORS, and OpenAPI support. |
| API Documentation | Swashbuckle.AspNetCore; Microsoft.AspNetCore.OpenApi | 10.1.7; 10.0.8 | Provides Swagger UI and OpenAPI contracts for development and API review. |
| ORM / Data Access | Entity Framework Core | 10.0.8 | Supports DbContext, repository implementation, LINQ queries, and schema migrations. |
| PostgreSQL Provider | Npgsql.EntityFrameworkCore.PostgreSQL | 10.0.1 | Connects EF Core to PostgreSQL. |
| Primary Database | PostgreSQL | Version to be fixed by deployment environment | Relational data store for users, companies, jobs, job categories, job levels, and refresh tokens. |
| Authentication | Microsoft.AspNetCore.Authentication.JwtBearer | 10.0.8 | Validates JWT access tokens, supports role claims, and reads access tokens from cookies when present. |
| Password Hashing | BCrypt.Net-Next | 4.2.0 | Stores passwords using a salted adaptive hashing algorithm instead of plain text or fast hashes. |
| External Identity | Google OAuth client flow | Google client integration via backend HTTP client and frontend Google OAuth package | Supports Google login verification for user authentication. |
| File / Object Storage | AWSSDK.S3 with S3-compatible endpoint | 4.0.23.4 | Stores uploaded files and media outside the relational database. |
| Frontend Framework | Next.js | 16.2.6 | Provides route-based React application structure and production build tooling. |
| Frontend Language | TypeScript | 6.0.3 | Improves maintainability with compile-time type checking. |
| Frontend UI Runtime | React / React DOM | 19.2.6 | Component-based UI for Candidate, HR, and Admin experiences. |
| Frontend Styling | Tailwind CSS | 4.3.0 | Utility-first styling aligned with the existing shadcn UI setup. |
| Frontend Component System | shadcn, Radix UI, Base UI, Lucide React | shadcn 4.7.0; radix-ui 1.4.3; @base-ui/react 1.5.0; lucide-react 1.16.0 | Provides accessible UI primitives, reusable components, and consistent icons. |
| Frontend HTTP Client | Axios | 1.16.1 | Centralized JSON HTTP calls from frontend to backend REST APIs. |
| Server State Management | TanStack React Query | 5.100.11 | Handles remote data fetching, caching, and request status in the frontend. |
| Client State Management | Redux Toolkit | 2.12.0 | Manages local application state such as authentication and modals. |
| Forms / Validation | React Hook Form, Zod, @hookform/resolvers | 7.76.0; 4.4.3; 5.2.2 | Provides typed form validation and consistent form handling. |
| Tables / Dashboard Charts | TanStack Table, Recharts | 8.21.3; 3.8.0 | Supports admin/HR data tables and dashboard visualization. |
| Backend Build Tool | .NET SDK / MSBuild | .NET 10 SDK | Builds the multi-project backend solution. |
| Frontend Build Tool | Next.js build pipeline | 16.2.6 | Builds the production frontend app. |
| Backend Migration Tool | EF Core Migrations | 10.0.8 | Version-controls database schema changes under `Infrastructure/Persistence/Migrations`. |
| Frontend Linting / Formatting | ESLint, eslint-config-next, Prettier, prettier-plugin-tailwindcss | 9.39.4; 16.2.6; 3.8.3; 0.8.0 | Maintains frontend code quality and formatting consistency. |
| Backend Test Framework | Not currently present in repository; planned xUnit + Moq recommended | TBD | Test project should be added before production release for use case, repository, and controller coverage. |
| Cache | None currently implemented | N/A | Current scale does not require distributed caching; can add Redis later for high-traffic reads or distributed sessions. |
| Message Queue | None currently implemented | N/A | Current workflows are synchronous REST; future AI CV screening or notifications may introduce a queue. |
| Containerisation | Not currently present in repository; Docker recommended | TBD | Dockerfile and docker-compose are not yet defined; recommended for repeatable local and staging deployments. |
| CI/CD | Not currently present in repository; GitHub Actions recommended | TBD | Automated build, lint, typecheck, and test pipeline should be added before release. |
| Monitoring | Not currently implemented; ASP.NET Core logging baseline | TBD | Production should add application health checks, structured logs, and uptime/error monitoring. |
| Logging | ASP.NET Core built-in logging | .NET 10 | Existing backend uses ASP.NET Core logging configuration; production can add structured sinks later. |

## 1.5 Deployment Architecture

> **Diagram required — skipped as requested**
> Deployment diagram should be created in draw.io as `CareerHub_DeploymentDiagram.drawio` and embedded here.
> Required content: client browser, frontend hosting, backend API hosting, PostgreSQL instance, S3-compatible object storage, Google OAuth, environment boundaries, and HTTPS/REST labels.

Development runs the Next.js frontend and ASP.NET Core backend locally as separate processes. The backend connects to local PostgreSQL and applies EF Core migrations on startup outside the testing environment.

Staging mirrors production with deployed frontend/backend services, a dedicated PostgreSQL database, staging object storage, and Google OAuth test credentials.

Production exposes the frontend and backend through HTTPS. PostgreSQL remains private to the backend, object storage uses production credentials, and all secrets must be stored outside committed configuration files.

| Aspect | Development | Staging | Production |
| --- | --- | --- | --- |
| Infrastructure | Local developer machine; Next.js dev server and ASP.NET Core API process | Cloud or VPS environment matching production shape | Cloud or VPS production environment |
| Frontend Hosting | `next dev --turbopack` locally | Deployed Next.js build, recommended Vercel or Node host | Deployed Next.js build, recommended Vercel or Node host with HTTPS/CDN |
| Backend Hosting | `dotnet run` for `JobHunter.WebAPI` | ASP.NET Core hosted as a service/container/process | ASP.NET Core hosted as a service/container/process behind HTTPS reverse proxy or platform ingress |
| Database | Local PostgreSQL database named `jobhunter` | Dedicated staging PostgreSQL database | Dedicated production PostgreSQL database with backups |
| Schema Migration | EF Core migrations applied automatically on API startup except testing | EF Core migrations applied during deployment/startup after backup | EF Core migrations applied through controlled deployment process |
| Object Storage | S3-compatible dev endpoint/bucket | Separate staging bucket and credentials | Production S3-compatible bucket with restricted access policies |
| Authentication | JWT with local/staging secrets; Google OAuth test client | JWT with staging secret; Google OAuth staging client | JWT with production secret; Google OAuth production client |
| Network Access | Frontend and backend may run on localhost; CORS allows localhost | HTTPS frontend calls HTTPS API; database private to backend | HTTPS-only public access; database and storage credentials private to backend |
| Scaling | Single frontend process and single backend process | Single instance unless load testing requires more | Start with single backend instance; scale horizontally when traffic requires it |
| External APIs | Google OAuth and S3-compatible storage using development credentials | Google OAuth and S3-compatible storage using staging credentials | Google OAuth and S3-compatible storage using production credentials |
| Monitoring | Console logs and Swagger/manual testing | Application logs, API smoke tests, basic uptime checks | Structured logs, health checks, error tracking, uptime monitoring, and alerting |

# Part 2 — Interface Specification

> **Guidance — Part 2**
> Answers: How do users and external systems interact with this application?
> 'Interface' is architecture-neutral — covers SSR pages, REST APIs, events, internal service contracts.
> IMPORTANT: Start with Section 2.1 Interface Inventory — classify every feature first.
> Screen layout and interaction design are NOT documented here.

## 2.1 Interface Inventory & Classification

> **Guidance — 2.1**
> For every SRS feature (FT-xx), decide what type of interface it requires.
> Interface types:
> SSR Page — server renders full HTML (Thymeleaf, JSP, Razor)
> REST API — JSON over HTTP; AJAX, mobile clients, webhooks, external systems
> GraphQL — query-based API (if applicable)
> Internal Service — Java/C# interface called within same process (monolith only)
> Event / Message — async via queue or event bus
> Scheduled Job — no user-facing interface; triggered by time
> Webhook Receiver — inbound HTTP call from external system

| Feature (FT-xx) | Feature Name | Interface Type | Reason for Choice |
| --- | --- | --- | --- |
| FT-01 | [Feature name] | [Interface type] | [Why SSR vs API vs event vs job] |
| FT-02 |  |  |  |
| [Add rows] |  |  |  |

## 2.2 Authentication & Session / Token Design

> **Guidance — 2.2**
> Implementation-level detail for authentication — not policy (policy is in SRS NFR-SEC).
> Choose: Session-based (monolith with SSR), JWT (stateless REST / SPA / mobile), OAuth2+OIDC.
> Show the full authentication sequence as a diagram or numbered steps.

> **Diagram Placeholder — Authentication Flow**
> Tool: draw.io | File: [ProjectName]_AuthFlow.drawio

### Session-Based Auth (fill if applicable)

| Aspect | Design Decision |
| --- | --- |
| Session store | [In-memory (single node only) / Redis (multi-node)] |
| Session timeout | [e.g. 30 min inactivity, 8 hr absolute] |
| Session ID location | [HTTP-only cookie — name: JSESSIONID] |
| Concurrent sessions | [Allow all / limit to 1 / configurable per role] |
| Session fixation prevention | [Invalidate and reissue on login — Spring Security default] |
| CSRF protection | [Synchronizer token pattern — enabled by default in Spring Security] |

### JWT-Based Auth (fill if applicable)

| Aspect | Design Decision |
| --- | --- |
| Token format | [JWT — HS256 / RS256] |
| Access token expiry | [e.g. 15 minutes] |
| Refresh token expiry | [e.g. 7 days] |
| Token storage (client) | [HttpOnly cookie / localStorage — note security tradeoff] |
| Token blacklist strategy | [Redis key store for invalidated tokens] |
| Claims included | [`sub`, `role`, `iat`, `exp` — list all] |

## 2.3 Server-Side Pages (SSR)

> **Guidance — 2.3**
> Fill only for features delivered as server-rendered pages (SSR Page from 2.1).
> For each page: URL pattern, HTTP method, Controller#method, template, model attributes, auth roles.
> URL pattern: use path parameters for IDs — /orders/{orderId} not /getOrder?id=xxx
> Skip this section entirely if the application has no SSR pages (pure SPA or API-only).

| URL Pattern | Method | Controller#Method | Template | Model Attributes | Auth — Roles |
| --- | --- | --- | --- | --- | --- |
| /[resource] | GET | [Controller#method] | [template-name] | [attr: Type] | [Roles] |
| /[resource]/{id} | GET |  |  |  |  |
| /[resource]/{id}/[action] | POST |  |  |  |  |
| [Add rows] |  |  |  |  |  |

## 2.4 REST API Endpoints

> **Guidance — 2.4**
> Fill for features delivered as REST APIs (REST API or Webhook Receiver type from 2.1).
> For each endpoint: HTTP method + URL, request (headers/params/body), response (all status codes).
> For large APIs (10+ endpoints), maintain full spec in OpenAPI/Swagger YAML; reference here.
> REQUIRED: every error response must reference an error code from the Error Code Registry (Part 8.1).

### API Conventions

| Convention | Decision |
| --- | --- |
| Base URL | `/api/v[N]/` |
| Versioning strategy | [URL path `/v1/` / Header `API-Version: 1`] |
| Date/time format | [ISO 8601 UTC — `2024-01-15T08:30:00Z`] |
| Pagination | [Cursor-based / Offset — `?page=0&size=20`] |
| Error response format | `{"error_code": "...", "message": "...", "field": "..."}` |
| Correlation ID header | `X-Correlation-ID` — required on all requests |
| OpenAPI spec file | [ProjectName]_OpenAPI.yaml |

### [HTTP METHOD] /api/v1/[resource] — [Description]

> **Guidance — Endpoint block**
> Repeat this block for each REST endpoint. Include:
> Purpose (1 sentence), Related SRS Feature (FT-xx), Authorization (roles / API key)
> Request: headers, path params, query params, request body with field constraints
> Responses: ALL possible HTTP status codes with response body structure

| Attribute | Value |
| --- | --- |
| Purpose | [One sentence describing what this endpoint does] |
| Related SRS Feature | [FT-xx] |
| Authorization | [Role(s) / API key / Public] |

**Request format**

```http
Headers:
Authorization: Bearer {token} [if JWT]
Content-Type: application/json
X-Correlation-ID: {uuid} [required]
Path Parameters:
{param}: [type] — [description]
Query Parameters:
[param]: [type] — [description] — default: [value]
Request Body:
{
"[field]": "[type]", // [constraint: required / max 255 chars / etc.]
"[field]": "[type]"
}
```

| HTTP Status | Condition | Response Body |
| --- | --- | --- |
| 200 OK | [Success condition] | { "[field]": "[type]", ... } |
| 201 Created | [Created condition] | { "[field]": "[type]", ... } |
| 400 Bad Request | [Validation failure] | { "error_code": "ERR_xxx", "message": "...", "field": "..." } |
| 401 Unauthorized | Invalid / missing token | { "error_code": "AUTH_001", "message": "..." } |
| 403 Forbidden | Insufficient role | { "error_code": "AUTH_002", "message": "..." } |
| 404 Not Found | Resource not found | { "error_code": "ERR_xxx", "message": "..." } |
| 409 Conflict | BR violation (e.g. BR-04) | { "error_code": "ERR_xxx", "message": "..." } |
| 422 Unprocessable | DC violation (e.g. DC-02) | { "error_code": "ERR_xxx", "message": "..." } |
| 500 Server Error | Unexpected error | { "error_code": "SYS_001", "message": "Contact support" } |

[Repeat the endpoint block above for each REST API endpoint]

## 2.5 Internal Service Interfaces

> **Guidance — 2.5**
> REQUIRED for Monolith. Optional for other architectures.
> In a monolith, modules communicate via direct method calls — these are the contracts between layers,
> equivalent to API contracts in microservices.
> Document key service interfaces so different developers can work on different layers independently.

**Internal Service Interface Template (Java)**

```java
// [ServiceName] — one-sentence responsibility
public interface [ServiceName] {
/**
* [Method description — what it does, when to call it]
* @param [param] [description + constraints]
* @return [return type + description]
* @throws [ExceptionType] [when thrown — reference BR-xx or DC-xx]
*/
[ReturnType] [methodName]([ParamType] [param]);
// Add all key public methods
}
```

> **ARCH — Event-Driven / Microservices: replace 2.5 with Event/Message Schema Catalog**
> List all events/messages with: event name, producer, consumer(s), payload schema,
> ordering guarantee (none / per-key / global), retry policy.

# Part 3 — Data Model

> **Guidance — Part 3**
> Answers: How is data structured, stored, and managed at the physical level?
> This is the technical implementation of the data requirements in SRS Part 4.

## 3.1 Physical Entity Relationship Diagram (ERD)

> **Guidance — 3.1**
> Physical ERD — includes all tables, columns with data types, PKs, FKs, indexes.
> Different from the conceptual ERD in SRS Part 4.1 (which shows business entities only).
> Use crow's foot notation. Show: all tables including junction tables, column names and types,
> PK (bold/underlined), FK (arrow), index indicators, and cardinality (1:1, 1:N, M:N).

> **Diagram Placeholder — Physical ERD**
> INSERT HERE: Physical ERD with all tables, columns, types, PKs, FKs, and indexes.
> Conceptual ERD for business stakeholders: SRS Part 4.1
> Physical ERD for dev/DBA: here (TDS Part 3.1)
> Tool: draw.io | File: [ProjectName]_PhysicalERD.drawio

## 3.2 Database Schema (DDL)

> **Guidance — 3.2**
> Provide full CREATE TABLE statements. Naming: snake_case for tables and columns.
> Every table must have: primary key, created_at timestamp, appropriate constraints.
> All CHECK constraints should reference the SRS DC-xx that requires them.
> This DDL is the source of truth — migration scripts should be generated from or validated against it.

**DDL Template — [table_name]**

```sql
-- [TABLE NAME] — [one-line description]
-- SRS Reference: [Entity from SRS 4.1], [DC-xx constraints]
CREATE TYPE [enum_type] AS ENUM ('val1', 'val2', 'val3'); -- if PostgreSQL
CREATE TABLE [table_name] (
[pk_column] [TYPE] PRIMARY KEY,
[column_name] [TYPE] NOT NULL,
[column_name] [TYPE] NOT NULL DEFAULT [value],
[fk_column] [TYPE] NOT NULL
REFERENCES [ref_table]([ref_col]) ON DELETE RESTRICT,
[amount_col] DECIMAL(12,2) NOT NULL CHECK ([col] >= 0), -- DC-xx
[enum_col] [ENUM_TYPE] NOT NULL DEFAULT 'value',
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE ([col1], [col2]) -- BR-xx: [reason]
);
-- Indexes — justify each one with the query pattern it supports
CREATE INDEX idx_[table]_[col] ON [table_name]([col]); -- [query pattern]
-- [Repeat for each table]
```

## 3.3 ORM / ODM Entity Mapping

> **Guidance — 3.3**
> Document how the DB schema maps to application-layer entity classes.
> Prevents common JPA/Hibernate pitfalls: wrong fetch type (causing N+1 queries),
> missing cascade settings (orphan records), incorrect column naming.
> Skip if the application uses raw JDBC/SQL without an ORM.

**ORM Entity Template (JPA / Spring)**

```java
@Entity
@Table(name = "[table_name]")
public class [EntityClass] {
@Id
@Column(name = "[pk_column]", length = [len])
private [Type] [fieldName];
@Column(name = "[column]", nullable = false, length = [len])
private [Type] [fieldName];
@Enumerated(EnumType.STRING)
@Column(name = "[enum_col]", nullable = false)
private [EnumType] [fieldName];
// One-to-Many: specify fetch type explicitly — never leave as default
@OneToMany(mappedBy = "[field]", fetch = FetchType.LAZY,
cascade = CascadeType.ALL, orphanRemoval = true)
private List<[ChildEntity]> [children] = new ArrayList<>();
// Many-to-One
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "[fk_column]", nullable = false)
private [ParentEntity] [parent];
}
```

| Entity | Fetch Strategy | Cascade | Reason |
| --- | --- | --- | --- |
|  | LAZY | ALL | [e.g. children loaded on-demand to avoid N+1] |
|  | LAZY | NONE | [e.g. parent has independent lifecycle] |
| [Add rows] |  |  |  |

## 3.4 Indexing & Query Strategy

> **Guidance — 3.4**
> For each index, document the query pattern it supports and the cardinality estimate.
> Flag any queries that risk N+1 and how they are addressed (join fetch, batch fetch, etc.).

| Index | Table | Column(s) | Query Pattern | Cardinality | Notes |
| --- | --- | --- | --- | --- | --- |
| idx_[name] | [table] | [col] | [e.g. filter by status in queue] | High / Medium / Low |  |
| [Add rows] |  |  |  |  |  |

| Query | N+1 Risk | Mitigation |
| --- | --- | --- |
| [e.g. Order list with items] | N+1 on OrderItems | [e.g. @EntityGraph or JOIN FETCH] |
| [Add rows] |  |  |

## 3.5 Data Migration Strategy

| Aspect | Decision |
| --- | --- |
| Migration tool | [Flyway / Liquibase / Manual] |
| Migration file location | [src/main/resources/db/migration/] |
| Naming convention | [V{version}__{description}.sql — e.g. V1.0.0__create_orders_table.sql] |
| Rollback strategy | [Flyway Pro undo scripts / Manual rollback scripts / Blue-green deploy] |
| Run on startup | [Yes — auto-migrate / No — manual trigger] |
| Validation | [Flyway validates checksum on every startup] |

# Part 4 — Integration & Communication Design

> **Guidance — Part 4**
> Answers: How does this system communicate with external systems and internal components?
> Cover both synchronous (HTTP, direct call) and asynchronous (queue, events) communication.
> For each integration: endpoint, auth method, payload format, error handling, retry policy.

## 4.1 External System Integration Map

> **Guidance — 4.1**
> One row per external system. At-a-glance reference — details in 4.2–4.4.

| External System | Direction | Protocol | Auth Method | Sync/Async | Error Handling | SRS Ref |
| --- | --- | --- | --- | --- | --- | --- |
| [e.g. Payment Gateway] | Outbound + Inbound webhook | HTTPS/REST | [API key / OAuth2] | Both | [Retry N times; alert] | FT-xx |
| [e.g. Courier API] | Outbound + Inbound webhook | HTTPS/REST | [API key] | Both | [Manual fallback] | FT-xx |
| [Add rows] |  |  |  |  |  |  |

## 4.2 Webhook Handling Design

| Aspect | Design Decision |
| --- | --- |
| Signature verification | [e.g. HMAC-SHA256 of request body using shared secret from env var] |
| Signature header | [e.g. `X-Signature-256: sha256={hash}`] |
| Idempotency key | [e.g. event_id in payload — deduplicated via Redis SETNX or DB unique constraint] |
| Response strategy | [Respond HTTP 200 immediately; process in background thread / queue] |
| Processing timeout | [e.g. background job must complete within 30 seconds] |
| Retry on failure | [e.g. 3 retries with exponential backoff: 1s, 5s, 25s] |
| Dead letter handling | [e.g. after 3 failures: log to dead_letter_events table; alert Admin] |

## 4.3 Synchronous External API Integration

> **Guidance — 4.3**
> Repeat this block per external API. Include sequence diagram.

### [External System Name] — [Integration Purpose]

| Aspect | Detail |
| --- | --- |
| Base URL (production) | [https://api.system.com/v1] |
| Base URL (sandbox) | [https://sandbox.system.com/v1] |
| Authentication | [e.g. API key in header X-API-Key from env var EXTERNAL_API_KEY] |
| Triggered by | [FT-xx — e.g. barcode scan triggers courier pick-up request] |
| Timeout | [e.g. 10 seconds — maps to BV-04b in SRS] |
| Retry policy | [e.g. 2 retries, 2s delay, only on 5xx or network timeout] |
| Circuit breaker | [e.g. open after 5 failures in 60s; half-open after 30s] |
| Fallback | [e.g. show manual tracking number entry — AC-14] |

> **Diagram Placeholder — [ExternalSystem] Sequence Diagram**
> INSERT HERE: Sequence diagram showing interaction with this external system.
> Tool: draw.io | File: [ProjectName]_[ExternalSystem]_SequenceDiagram.drawio

## 4.4 Asynchronous Communication Design

> **Guidance — 4.4**
> Fill if the application uses message queues, event buses, or async job processing.
> Skip if the application is fully synchronous.
> ARCH — Required for: Microservices, Event-Driven, and Monolith using queues for background processing.

| Aspect | Decision |
| --- | --- |
| Message broker | [RabbitMQ / Kafka / AWS SQS / None] |
| Message format | [JSON / Avro / Protobuf] |
| Delivery guarantee | [At-most-once / At-least-once / Exactly-once] |
| Ordering guarantee | [None / Per-partition key] |
| Consumer ACK | [Auto-ack / Manual ack after processing] |
| Dead letter queue | [e.g. DLQ after 3 failed attempts; alert on DLQ depth > 0] |

| Event / Queue Name | Producer | Consumer(s) | Trigger | Payload Summary |
| --- | --- | --- | --- | --- |
| [e.g. order.confirmed] | [Component] | [Component] | [Payment confirmed] | { order_id, customer_id, items[] } |
| [Add rows] |  |  |  |  |

## 4.5 Architecture-Specific Communication Patterns

### Monolith — Transaction Boundary Design

> **Guidance — Monolith Transaction Boundaries**
> REQUIRED for monolith. Document @Transactional scope for each key use case.
> Wrong transaction scope causes: data inconsistency (too narrow) or lock contention (too broad).
> Rule: sending notifications and firing events must be OUTSIDE the transaction — after commit.

| Use Case / Method | Transaction Scope | Operations INSIDE Tx | Operations OUTSIDE Tx (why) |
| --- | --- | --- | --- |
| [ServiceMethod] | @Transactional | [stock decrement + status update + create notification record] | [send actual notification — failure must not rollback order] |
| [Add rows] |  |  |  |

### Microservices — Distributed Transaction / Saga Design

> **ARCH — Microservices only**
> Pattern choice: Choreography Saga (event-driven) or Orchestration Saga (central coordinator).

| Step | Service | Action | Compensating Action (on failure) |
| --- | --- | --- | --- |
| 1 | [Service] | [Action] | [Rollback action] |
| 2 | [Service] | [Action] | [Rollback action] |
| [Add rows] |  |  |  |

# Part 5 — Security Design

> **Guidance — Part 5**
> Translates security NFRs (NFR-SEC01–SEC05) into concrete implementation decisions.
> Each section should answer: how exactly is this implemented in code?

## 5.1 Authentication Flow

## 5.2 Authorization & RBAC Implementation

| Aspect | Decision |
| --- | --- |
| RBAC implementation | [e.g. Spring Security @PreAuthorize / Custom @Secured / Filter chain] |
| Role storage | [e.g. User table `role` column / JWT claim / Separate role-permission table] |
| Role hierarchy | [e.g. ADMIN > MANAGER > WAREHOUSE > CUSTOMER] |
| Permission check layer | [e.g. Controller for URL; Service for data-level (own records)] |
| Failed auth response | [HTTP 403 with AUTH_002 — no role information disclosed] |

## 5.3 Data Protection

| Data Category | At Rest | In Transit | Notes |
| --- | --- | --- | --- |
| All traffic | N/A | TLS 1.2+ (NFR-SEC01) |  |
| Passwords | bcrypt, cost >= 12 (NFR-SEC02) | TLS | Never logged |
| PII (name, email, phone) | [Encrypted at DB / App / Not encrypted — note risk] | TLS | Deletion per NFR-C02 |
| Payment data | Not stored (NFR-SEC03) | TLS | Delegated to payment gateway |
| Session tokens | HttpOnly cookie | TLS | SameSite=Strict |
| API keys (external) | Environment variables only | TLS | Never in source code or logs |

## 5.4 Input Validation Strategy

| Validation Type | Where Applied | Library / Mechanism | Example |
| --- | --- | --- | --- |
| Bean validation | Controller (request DTO) | [JSR-380 @Valid, @NotNull, @Size] | @NotBlank String name |
| Business rule validation | Service layer | Custom validators | quantity >= 1 && <= 10 (BR-01) |
| SQL injection prevention | Repository layer | [JPA parameterised / PreparedStatement] | Never string concatenation |
| XSS prevention | Presentation layer | [Thymeleaf auto-escaping / CSP header] |  |
| File upload (if applicable) | Controller | [File type whitelist, size limit] |  |

## 5.5 Security Headers & CORS Policy

| Header | Value | Reason |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `Content-Security-Policy` | [Define per environment] | XSS mitigation |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |  |

| Environment | Allowed Origins | Allowed Methods | Allow Credentials |
| --- | --- | --- | --- |
| Development | * or http://localhost:[port] | GET, POST, PUT, DELETE | true |
| Staging | https://staging.[domain] | GET, POST, PUT, DELETE | true |
| Production | https://[domain] | GET, POST, PUT, DELETE | true |

# Part 6 — Key Algorithms & Business Logic

> **Guidance — Part 6**
> Translates SRS state transition table, business rules, and ACs into implementation-level design.
> Dev should be able to implement from this section without re-reading the SRS.
> Write pseudocode, patterns, and decision tables — not production code.

## 6.1 State Machine Implementation

> **Guidance — 6.1**
> Translate SRS Part 4.4 State Transition Table into a code-level design.
> Pattern choices: plain conditionals (simple), State Pattern (moderate), Spring Statemachine (complex).
> Document: pattern chosen, guard condition implementation, invalid transition rejection.

| Aspect | Decision |
| --- | --- |
| Pattern | [Plain conditionals / State Pattern / Spring Statemachine / Other] |
| Reason | [Why this pattern fits the complexity level] |
| Invalid transition response | [HTTP 400 + error_code from Error Code Registry + log attempt] |

**State Machine Pseudocode**

```text
function transitionStatus(entity, event):
allowed = TRANSITION_MAP[entity.currentStatus]
if event not in allowed:
guard = allowed[event].guard
if not guard.evaluate(entity, context):
throw GuardConditionNotMetException(guard.reason)
entity.status = allowed[event].toStatus
for action in allowed[event].actions:
action.execute(entity) // stock decrement, notify, etc.
TRANSITION_MAP = {
'StateA': {
'EVENT_1': { to: 'StateB', guard: [condition], actions: [action1, action2] },
'EVENT_2': { to: 'Cancelled', guard: always, actions: [rollback] }
},
// [Add all states from SRS Part 4.4]
}
```

## 6.2 Concurrency & Consistency Handling

| Operation | Race Condition Risk | Strategy | Implementation |
| --- | --- | --- | --- |
| [e.g. Stock decrement] |  | [Optimistic locking / SELECT FOR UPDATE] | [e.g. @Version field; retry on OptimisticLockException] |
| [e.g. Processing lock] | Two users click Start simultaneously | [DB-level lock / Redis distributed lock] | [e.g. UPDATE SET locked_by=? WHERE locked_by IS NULL] |
| [Add rows] |  |  |  |

## 6.3 Transaction Boundary Design

> **REQUIRED for Monolith — see also Part 4.5**
> General rule: one @Transactional per use case service method.
> Operations that must NOT be inside the transaction (run after commit):
> - Sending external notifications (failure must not rollback the business operation)
> - Calling external APIs (network failures must not rollback DB changes)
> - Publishing events / messages (event should only fire after state is durable in DB)

**Transaction Boundary Example**

```text
function confirmOrder(orderId, payment):
validateWebhookSignature(payment) // inside
order = loadOrder(orderId) // inside
validateTransition(order, CONFIRMED) // inside
decrementStock(order.items) // inside — MUST rollback with order
order.status = CONFIRMED // inside
notifRecord = createNotification(...) // inside — DB record created
// After commit — outside transaction:
publishEvent(OrderConfirmedEvent) // outside — fires after state is durable
```

## 6.4 Scheduled Jobs & Background Tasks

| Job Name | Schedule (cron) | Description | Idempotency | Failure Handling |
| --- | --- | --- | --- | --- |
| [JobName] | [0 0 */6 * * *] | [What it does] | [e.g. processes PENDING records; safe to re-run] | [Log + alert; retry next cycle] |
| [Add rows] |  |  |  |  |

## 6.5 Notification Dispatch Design

> **Guidance — 6.5**
> Document how notifications are routed to the correct channel.
> Include: channel routing logic, template management, retry policy, suppression rules (e.g. BR-05).

**Notification Dispatch Pseudocode**

```text
function dispatchNotification(notificationRecord):
channel = resolveChannel(notificationRecord.order.sourceChannel)
template = loadTemplate(notificationRecord.type, channel)
message = template.render(notificationRecord.data)
result = channel.send(notificationRecord.customerId, message)
if result.success:
notificationRecord.status = SENT
notificationRecord.sentAt = now()
else:
scheduleRetry(notificationRecord, attempt + 1)
// Max 3 retries; after that: status = FAILED, alert Admin
```

# Part 7 — Performance & Scalability Design

> **Guidance — Part 7**
> Translates NFR-Pxx and NFR-Sxx from the SRS into concrete technical strategies.
> Every design decision here should reference the NFR ID it satisfies.

## 7.1 Caching Strategy

| What is Cached | Cache Key Pattern | TTL | Invalidation Trigger | NFR Satisfied |
| --- | --- | --- | --- | --- |
| [e.g. Product/SKU details] | product:{sku_id} | [e.g. 5 min] | [On product update] | NFR-Pxx |
| [e.g. User roles] | user:roles:{user_id} | [e.g. 15 min] | [On role change] | NFR-SECxx |
| [Add rows] |  |  |  |  |

Cache implementation: [Redis / Caffeine (in-process) / None]

## 7.2 Database Query Optimization

| Query Scenario | Volume Estimate | Optimization Applied | Index Used |
| --- | --- | --- | --- |
| [e.g. Order inbox list] | [e.g. 100–200 orders/page] | [Pagination + index on status+created_at] | idx_orders_status |
| [Add rows] |  |  |  |

Pagination strategy: [Cursor-based (large datasets) / Offset (small datasets)] — reason: [justify]

## 7.3 Scaling Approach

| NFR Target | Current Approach | Scaling Mechanism | Constraint |
| --- | --- | --- | --- |
| NFR-S01: >= 1,000 concurrent users | [Single / Multiple instances] | [Horizontal scaling — stateless + shared session store] | [DB connection pool limit] |
| NFR-S02: No code changes for scaling | [Stateless design] | [Load balancer + multiple app instances] | [Shared session store required] |
| [Add rows] |  |  |  |

## 7.4 Load Testing Plan

| NFR | Test Type | Tool | VUs | Ramp-up | Duration | Pass Threshold |
| --- | --- | --- | --- | --- | --- | --- |
| NFR-P01 | Load test | k6 | 500 | 60s | 5 min | p95 < 2s, error < 1% |
| NFR-S01 | Stress test | k6 | 1000 | 120s | 10 min | No degradation, error < 1% |
| [Add rows] |  |  |  |  |  |  |

# Part 8 — Error Handling & Observability

> **Guidance — Part 8**
> Defines the operational contract — how failures are detected, communicated, and investigated.
> The Error Code Registry (8.1) must be defined early and shared with frontend teams.
> Format: [DOMAIN]_[NUMBER] — e.g. AUTH_001, ORDER_001, STOCK_001, SYS_001

## 8.1 Error Code Registry

> **REQUIRED**
> Define all error codes before implementation begins.
> Every REST API error response in Part 2.4 must reference a code from this registry.
> Format: [DOMAIN]_[NUMBER] — e.g. AUTH_001, ORDER_001, STOCK_001, SYS_001

| Error Code | HTTP Status | User-Facing Message | Internal Trigger | SRS Reference |
| --- | --- | --- | --- | --- |
| AUTH_001 | 401 | Session expired. Please log in again. | Invalid/missing token | NFR-SEC01 |
| AUTH_002 | 403 | You don't have permission to perform this action. | RBAC check failed | NFR-SEC05 |
| SYS_001 | 500 | An unexpected error occurred. Please contact support. | Unhandled exception | — |
| [DOMAIN]_001 | [4xx/5xx] | [Plain language — no technical detail] | [Code trigger] | [BR-xx / DC-xx] |
| [Add rows] |  |  |  |  |

## 8.2 Logging Standard

| Field | Type | Description | Example |
| --- | --- | --- | --- |
| `timestamp` | ISO 8601 UTC | When the event occurred | `2024-03-18T08:30:00.123Z` |
| `level` | ENUM | ERROR / WARN / INFO / DEBUG | `INFO` |
| `service` | String | Application / service name | `shopeasy-app` |
| `correlation_id` | UUID | End-to-end request trace ID (NFR-M02) | `a1b2c3d4-...` |
| `user_id` | String | Authenticated user (if applicable) | `usr-001` |
| `message` | String | Human-readable event description | `Order confirmed` |
| [context fields] |  | Feature-specific context | `order_id: ORD-...` |

| Level | When to Use | Examples |
| --- | --- | --- |
| ERROR | Unexpected failures requiring investigation | Unhandled exception, DB connection loss |
| WARN | Expected but noteworthy failures | Webhook signature mismatch, retry attempt |
| INFO | Significant business events | Order confirmed, user login, scheduled job done |
| DEBUG | Detailed trace for development (disabled in prod) | SQL queries, method entry/exit |

> **Never log**
> Passwords, payment card data, full PII without masking, auth tokens.
> Any secret or credential — even temporarily. Rotate immediately if leaked.

## 8.3 Monitoring & Alerting

| Metric | Source | Alert Threshold | Alert Channel | NFR Reference |
| --- | --- | --- | --- | --- |
| HTTP p95 response time | APM / Load balancer | > 2s sustained 5 min | [Slack / PagerDuty] | NFR-P01 |
| HTTP error rate (5xx) | APM | > 1% sustained 5 min | [Alert channel] | NFR-A01 |
| DB connection pool usage | DB metrics | > 80% | [Alert channel] | NFR-S01 |
| Scheduled job failure | Application log | Any failure | [Alert channel] | NFR-A04 |
| Dead letter queue depth | Queue metrics | > 0 | [Alert channel] | NFR-A04 |
| [Add rows] |  |  |  |  |

## 8.4 Distributed Tracing

| Aspect | Decision |
| --- | --- |
| Tracing tool | [Zipkin / Jaeger / OpenTelemetry / Datadog APM] |
| Trace ID propagation | [X-Correlation-ID header; set at entry point if absent] |
| Span creation | [Automatic for HTTP + DB; manual for external API calls] |
| Sampling rate | [100% in dev/staging; 10% in prod] |
| Log correlation | [Correlation ID in every log entry — ties logs to traces] |

# Part 9 — Development Guidelines

> **Guidance — Part 9**
> Ensures consistency across the development team.
> More critical for larger teams or projects with junior developers.
> For very small teams (1–2 senior devs): simplify to structure, naming, and testing essentials.

## 9.1 Project & Package Structure

> **Guidance — 9.1**
> Document the actual folder/package structure that corresponds to the Package Diagram (Part 1.3).
> Every developer should be able to determine where a new class belongs without asking.

**Project Structure Template**

```text
[project-root]/
├── src/
│ ├── main/
│ │ ├── java/
│ │ │ └── [com.company.project]/
│ │ │ ├── [module1]/
│ │ │ │ ├── controller/ # HTTP handlers
│ │ │ │ ├── service/ # Business logic interfaces + impl
│ │ │ │ ├── repository/ # Data access interfaces
│ │ │ │ ├── domain/ # Entities, value objects, enums
│ │ │ │ └── dto/ # Request/Response transfer objects
│ │ │ ├── [module2]/
│ │ │ ├── integration/ # External API clients
│ │ │ ├── config/ # Spring config, security config
│ │ │ └── exception/ # Custom exception classes
│ │ └── resources/
│ │ ├── db/migration/ # Flyway migration scripts
│ │ ├── templates/ # Thymeleaf templates (if SSR)
│ │ ├── application.yml
│ │ ├── application-dev.yml
│ │ └── application-prod.yml
│ └── test/
│ └── java/ [mirror main structure]
├── docker-compose.yml
└── pom.xml / build.gradle
```

## 9.2 Coding Standards & Conventions

| Convention | Rule | Example |
| --- | --- | --- |
| Class naming | PascalCase, descriptive noun | OrderConfirmationService |
| Method naming | camelCase, verb phrase | confirmOrder(), findByStatus() |
| Constants | SCREAMING_SNAKE_CASE | MAX_PENDING_ORDERS = 3 |
| DB column naming | snake_case | order_id, created_at |
| REST URL naming | Plural nouns, lowercase, hyphens | /api/v1/orders/{orderId} |
| Error messages | Plain language, no stack traces to users | 'Invalid quantity' not NPE message |
| TODO/FIXME | Must include ticket reference | // TODO: ORD-42 — handle lock expiry |
| Magic numbers | Named constants only | MAX_RETRY_ATTEMPTS = 3 not `> 3` |

### Code Review Checklist (minimum required before merge)

No business logic in controllers (belongs in service layer)

No raw SQL string concatenation (use parameterised queries)

All new endpoints have unit tests + at least 1 integration test

Error responses use Error Code Registry codes (Part 8.1)

No credentials / secrets in source code

Transaction boundaries match Part 4.5 / Part 6.3 design

New BR implementation references the BR-xx ID in a comment

## 9.3 Testing Strategy

| Test Type | Scope | Tool | Coverage Target | Where Runs |
| --- | --- | --- | --- | --- |
| Unit test | Service layer methods | [JUnit 5 + Mockito] | >= 80% line coverage on service layer | Local + CI |
| Integration test |  | [Spring Boot Test + MockMvc] | All AC-xx covered | CI |
| State transition test | All valid + invalid transitions (SRS 4.4) | [JUnit 5] | 100% rows covered | CI |
| API contract test | REST endpoints match OpenAPI spec | [Spring Cloud Contract / Pact] | All endpoints | CI |
| Load test | NFR-Pxx targets | [k6] | NFR-P01, P02, P03 | Pre-release |
| Security test | OWASP Top 10, NFR-SEC | [OWASP ZAP / manual] | NFR-SEC01–05 | Pre-release |

### Test Naming Convention

**Test naming: [MethodName]_[Scenario]_[ExpectedOutcome]**

```text
// Positive test
confirmOrder_whenPaymentConfirmed_shouldDecrementStockAndSendNotification()
// Negative tests (NAC)
confirmOrder_whenOrderAlreadyCancelled_shouldThrowStaleOrderException() // NAC-02a
createOrder_whenFourthPendingOrder_shouldReturnConflict409() // NAC-02b, BR-04
// State transition test
transition_fromShippedToProcessing_shouldRejectWithHttp400() // Invalid transition
```

## 9.4 CI/CD Pipeline Design

**Pipeline Stages**

```text
[Push to branch]
1. Build & Compile — fail fast on compile error
2. Unit Tests — fail on test failure or coverage < threshold
3. Code Quality Gates — SonarQube / Checkstyle (fail on critical issues)
4. Integration Tests — fail on test failure
5. Build Docker Image — tag with commit SHA
6. Deploy to Staging — blue-green or rolling (NFR-M03)
7. Smoke Tests — basic health check on staging
[Manual approval gate for production]
8. Deploy to Production — blue-green or rolling
9. Post-deploy Smoke Test
```

| Aspect | Decision |
| --- | --- |
| CI tool | [GitHub Actions / GitLab CI / Jenkins] |
| Branch strategy | [Git Flow / Trunk-based] |
| PR requirement | [>= 1 reviewer approval + all checks pass] |
| Deployment strategy | [Blue-green / Rolling update — NFR-M03: zero-downtime] |
| Rollback trigger | [Smoke test failure / Error rate spike > 5% in 5 min post-deploy] |
| Rollback mechanism | [Redeploy previous Docker image tag] |

# References & Diagram Index

## Referenced Documents

| Document | Version | Location | Purpose |
| --- | --- | --- | --- |
| Software Requirements Specification (SRS) | v[X.X] | [Link / Path] | Requirements baseline — WHAT the system must do |
| UI/UX Specification | v[X.X] | [Link / Path] | Screen designs and interaction flows |
| [ProjectName]_RTW.xlsx | v[X.X] | [Link / Path] | Traceability workbook (BR Register, NFR Tracker, etc.) |
| OpenAPI Specification | v[X.X] | [filename].yaml | Machine-readable REST API contract |

## Diagram Index

> **Guidance — Diagram Index**
> List every diagram referenced in this TDS. For each: type, section referenced, and draw.io filename.
> When the diagram is created: export as PNG and embed at the placeholder location in the relevant section.
> Store source draw.io files alongside this document for future editing.

| Diagram | Type | Referenced in | Source File |
| --- | --- | --- | --- |
| Component Diagram | Runtime / Component | Part 1.2 | [ProjectName]_ComponentDiagram.drawio |
| Package / Module Diagram | Source Code Structure | Part 1.3 | [ProjectName]_PackageDiagram.drawio |
| Deployment Architecture | Infrastructure | Part 1.5 | [ProjectName]_DeploymentDiagram.drawio |
| Authentication Flow | Sequence | Part 2.2 | [ProjectName]_AuthFlow.drawio |
| Physical ERD | Entity Relationship | Part 3.1 | [ProjectName]_PhysicalERD.drawio |
| [External System] Integration | Sequence | Part 4.3 | [ProjectName]_[System]_SequenceDiagram.drawio |
| [Entity] State Machine | State Machine | Part 6.1 | [ProjectName]_[Entity]StateMachine.drawio |
| [Add rows] |  |  |  |

— End of TDS Template —
