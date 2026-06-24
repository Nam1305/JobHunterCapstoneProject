**Functional Design Specification**

***Smart Career Platform (CareerHub) – Report 4***

| Version | *v1.0.0*     |
|---------|--------------|
| Date    | *22/06/2026* |

# Change Log

| **Version** | **Date**     | **Summary**            |
|-------------|--------------|------------------------|
| 1.0         | *22/06/2026* | Initial document draft |
| 1.0         | *23/06/2024* | Add Document Overview  |
| 1.0         | *24/06/2026* | Navigation Map         |

[Change Log 1](#change-log)

[1. Document Overview 3](#document-overview)

> [1.1 Notation & Conventions 3](#notation-conventions)
>
> [1.2 System Scope Summary 3](#system-scope-summary)
>
> [Actors: 3](#actors)
>
> [Inventory summary: 3](#inventory-summary)

[2. Navigation Map 4](#navigation-map)

> [2.1 Screen Index 4](#screen-index)
>
> [2.2 Navigation Flow by Role 5](#navigation-flow-by-role)
>
> [HR Manager — typical recruitment flow: 5](#hr-manager-typical-recruitment-flow)
>
> [Candidate — application flow: 5](#candidate-application-flow)
>
> [Interviewer — evaluation flow: 5](#interviewer-evaluation-flow)
>
> [Admin — user management flow: 5](#admin-user-management-flow)

[3. Screen Inventory 5](#screen-inventory)

> [Module: Authentication 6](#module-authentication)
>
> [SCR-01 — Sign In 6](#scr-01-sign-in)
>
> [SCR-02 — Register 6](#scr-02-register)
>
> [SCR-03 — {{SCREEN_NAME}} 7](#scr-03-screen_name)

[4. External API Inventory 9](#external-api-inventory)

[5. Background Job Inventory 9](#background-job-inventory)

> [5.1 Job Summary Table 9](#job-summary-table)
>
> [5.2 JOB-01 — Unlock Expired Locked Accounts 9](#job-01-unlock-expired-locked-accounts)
>
> [Processing steps: 9](#processing-steps)
>
> [Failure behavior: 10](#failure-behavior)
>
> [5.3 JOB-02 — Clean Up Old Audit Log Entries 10](#job-02-clean-up-old-audit-log-entries)
>
> [Processing steps: 10](#processing-steps-1)
>
> [Failure behavior: 10](#failure-behavior-1)

# 1. Document Overview

## 1.1 Notation & Conventions

| **Symbol**  | **Meaning**                                                            |
|-------------|------------------------------------------------------------------------|
| SCR-xx      | Screen identifier — unique, stable, never reused                       |
| API-xx      | External API endpoint identifier                                       |
| JOB-xx      | Background job identifier                                              |
| → SCR-xx    | Navigation: this action takes the user to screen SCR-xx                |
| \[Role\]    | Display condition: component visible only to this role                 |
| {Condition} | Display condition: component appears only when this data/state is true |
| ⬜          | Not started                                                            |
| 🔄          | In development                                                         |
| 🧪          | In testing                                                             |
| ✅          | Done — tested and accepted                                             |
| ⏭           | Deferred                                                               |
| ❌          | Cancelled                                                              |

## 1.2 System Scope Summary

CareerHub — Smart Career Platform

CareerHub is an online recruitment platform that connects employers and job seekers across multiple industries. The system supports job posting, candidate applications, CV and profile management, interview scheduling, and recruitment process tracking. To improve hiring efficiency, CareerHub provides AI-powered candidate-job matching, CV evaluation, resume parsing, and bulk candidate screening features for both recruiters and job seekers.

### Actors

| **Actor**            | **Role in the system**                                                                                                                                                                       |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Guest                | Unauthenticated visitors can browse the public homepage, job listings, job details, company profiles, and other publicly available recruitment information before registering or signing in. |
| Candidate            | Searches for jobs, manages profiles and CVs, applies for positions, tracks application status, communicates with recruiters, and receives AI-assisted job matching support.                  |
| HR Staff             | Creates and manages job postings, reviews applications, communicates with candidates, manages company profiles, and uses AI-powered recruitment features.                                    |
| System Administrator | Manages system configuration, user accounts, authentication, authorization, risk management, and content moderation.                                                                         |

### Inventory summary

| **Type**               | **Count** | **Notes** |
|------------------------|-----------|-----------|
| Screens                | 50        |           |
| External API endpoints | 5         |           |
| Background jobs        | 5         |           |

# 2. Navigation Map

## 2.1 Screen Index

## 2.2 Navigation Flow by Role

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Guidance</strong></p>
<p>One flow per actor showing the typical happy-path journey. Exception paths are covered in UCS Alternative Flows.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

### HR Manager — typical recruitment flow:

> Sign In (SCR-01) → HR Dashboard (SCR-05) → Job List (SCR-09)
>
> → Create / Edit Job (SCR-10) → back to SCR-09
>
> → Job Detail (SCR-11) → \[Publish job\] Draft → Active
>
> → Application List (SCR-15) → Application Detail (SCR-16)
>
> → \[Advance / Reject candidate\]
>
> → Assign Interviewer (SCR-17)
>
> → Pipeline Report (SCR-19)

### Candidate — application flow:

> Public Job Listings (SCR-12) → Job Detail / Public (SCR-13)
>
> → \[Click Apply\] → Sign In (SCR-01) {if not signed in}
>
> → Register (SCR-02) {if no account}
>
> → \[Submit application with CV\] → stay on SCR-13 with confirmation
>
> → My Applications (SCR-14) → \[Withdraw\] {if Applied or Screening}

### Interviewer — evaluation flow:

> Sign In (SCR-01) → Evaluation Form (SCR-18) \[via email link\]
>
> → \[Submit rating + feedback\] → confirmation
>
> → Application Detail (SCR-16) {read-only — own assigned only}

### Admin — user management flow:

> Sign In (SCR-01) → Admin Dashboard (SCR-06)
>
> → User Management (SCR-07) → \[Create / Deactivate / Unlock\]
>
> → Activity Log (SCR-08)

# 3. Screen Inventory

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Guidance</strong></p>
<p>Each screen block has 5 parts: 1. Header — SCR-ID, roles, FT/UC refs, purpose 2. UI Components — Component | Type | Description 3. Navigation Flow — bullets: action → SCR-ID 4. Display Conditions — {data} and [role] conditions 5. Status line NEVER include: SQL, HTTP codes, CSS classes, or class names. SCR-01 and SCR-02 below are full examples. SCR-03 is the copy-paste template for all additional screens.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## Module: Authentication

### SCR-01 — Sign In

*TalentHub example ▼ Full example — Sign In screen*

| **Who can see** | **All — accessible only when not signed in**                       |
|-----------------|--------------------------------------------------------------------|
| **FT-ID ref**   | FT-02 (Sign in), FT-05 (Account lockout)                           |
| **UC-ID ref**   | UC-02                                                              |
| **Purpose**     | Allows any user to authenticate and reach their role-specific area |

#### UI Components

| **Component**           | **Type**       | **Description**                                                                                                      |
|-------------------------|----------------|----------------------------------------------------------------------------------------------------------------------|
| System logo             | Image          | Centred above the form                                                                                               |
| Page title              | H1             | "Sign in to TalentHub"                                                                                               |
| Email field             | Input text     | Label "Email address", required                                                                                      |
| Password field          | Input password | Label "Password", show/hide toggle, required                                                                         |
| Sign In button          | Button primary | Full-width, submits the form                                                                                         |
| "Forgot password?" link | Text link      | Right-aligned below password field                                                                                   |
| Error banner            | Alert banner   | {Shown on failed sign-in} Generic: "Incorrect email or password" — never reveals which field is wrong                |
| Lockout banner          | Alert banner   | {Shown when account is locked} "Your account has been temporarily locked. Try again in 10 minutes or contact Admin." |

#### Navigation Flow

- Sign in success (Admin) → SCR-06 (Admin Dashboard)

- Sign in success (HR Manager) → SCR-05 (HR Dashboard)

- Sign in success (Interviewer) → SCR-16 (Application Detail — first assigned)

- Sign in success (Candidate) → SCR-14 (My Applications)

- Click "Forgot password?" → password reset email sent, stay on SCR-01

- Link "Create an account" → SCR-02 (Register)

#### Display Conditions

- Redirect to role dashboard immediately if user is already signed in

- Error banner and Lockout banner are mutually exclusive — show only one at a time

- "Forgot password?" link always visible even when lockout banner is shown

### SCR-02 — Register

*TalentHub example ▼ Full example — Registration screen with inline validation*

| **Who can see** | **Guest (unauthenticated visitors only)**          |
|-----------------|----------------------------------------------------|
| **FT-ID ref**   | FT-01                                              |
| **UC-ID ref**   | UC-01                                              |
| **Purpose**     | Allows a new Candidate to create their own account |

#### UI Components

| **Component**                   | **Type**          | **Description**                                                            |
|---------------------------------|-------------------|----------------------------------------------------------------------------|
| Page title                      | H1                | "Create your account"                                                      |
| Full name field                 | Input text        | Label "Full name", required                                                |
| Email field                     | Input text        | Label "Email address", required                                            |
| Password field                  | Input password    | Required. Helper: "At least 8 characters, 1 uppercase letter and 1 number" |
| Confirm password field          | Input password    | Label "Confirm password", required                                         |
| Create Account button           | Button primary    | Full-width. {Disabled while form has validation errors}                    |
| "Already have an account?" link | Text link         | → SCR-01 (Sign In)                                                         |
| Inline validation errors        | Alert (per field) | Shown below each field that fails validation on blur                       |

#### Navigation Flow

- Registration success → SCR-01 with banner: "Account created. Please sign in."

- Click "Already have an account?" → SCR-01

#### Display Conditions

- Redirect authenticated users to their dashboard — this page is for Guest only

- Create Account button disabled until all fields filled, passwords match, complexity rule met

- Email already in use → inline error: "This email address is already registered"

### SCR-03 — {{SCREEN_NAME}}

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Template</strong></p>
<p>Copy this block for each additional screen. Fill all {{PLACEHOLDERS}}. Delete grey example rows when done.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

| **Who can see** | {{WHO_CAN_SEE}} |
|-----------------|-----------------|
| **FT-ID ref**   | *{{FT_REF}}*    |
| **UC-ID ref**   | *{{UC_REF}}*    |
| **Purpose**     | *{{PURPOSE}}*   |

#### UI Components

| **Component**               | **Type**       | **Description**                          |
|-----------------------------|----------------|------------------------------------------|
| *{{COMPONENT_1}}*           | *{{TYPE_1}}*   | *{{DESC_1}}*                             |
| *{{COMPONENT_2}}*           | *{{TYPE_2}}*   | *{{DESC_2}}*                             |
| *{{COMPONENT_3}}*           | *{{TYPE_3}}*   | *{{DESC_3}}*                             |
| e.g. Current password field | Input password | Label "Current password", required       |
| e.g. New password field     | Input password | Required. Same complexity rule as SCR-02 |

*TalentHub ref (Change Password): Current password field, New password field, Save button*

#### Navigation Flow

*• {{NAV_1}} → {{TARGET_SCR_1}}*

*• {{NAV_2}} → {{TARGET_SCR_2}}*

*TalentHub ref: Success → SCR-04 (User Profile) · Cancel → SCR-04*

#### Display Conditions

*• {{DISPLAY_CONDITION_1}}*

*TalentHub ref: {Current password incorrect} Inline error · New passwords do not match → inline error on confirm field*

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Add more screen blocks here</strong></p>
<p>Copy the compact template block above for each remaining screen.</p>
<p>Fill in order from §2.1 Screen Index.</p>
<p>Remaining TalentHub screens:</p>
<p>Auth:</p>
<p>SCR-04 (User Profile)</p>
<p>Dashboard:</p>
<p>SCR-05 (HR Dashboard),<br />
SCR-06 (Admin Dashboard)</p>
<p>Admin:<br />
SCR-07 (User Management),<br />
SCR-08 (Activity Log)</p>
<p>Job Management:<br />
SCR-09 (Job List HR),<br />
SCR-10 (Create/Edit Job),<br />
SCR-11 (Job Detail HR)</p>
<p>Candidate Portal:</p>
<p>SCR-12 (Public Listings),</p>
<p>SCR-13 (Job Detail Public),</p>
<p>SCR-14 (My Applications)</p>
<p>Recruitment Pipeline:</p>
<p>SCR-15 (Application List HR),</p>
<p>SCR-16 (Application Detail HR)</p>
<p>Interview &amp; Evaluation:</p>
<p>SCR-17 (Assign Interviewer),</p>
<p>SCR-18 (Evaluation Form)</p>
<p>Dashboard:</p>
<p>SCR-19 (Pipeline Report)</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

# 4. External API Inventory

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Guidance</strong></p>
<p>Include only if the project has API-type UCs in UCS. If none exist, mark N/A and note future plans.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

N/A — {{PROJECT_NAME}} v1.0 does not expose any external-facing API endpoints.

*If APIs exist, add one block per endpoint: API-ID · Method · URL · Purpose · Caller · Auth · Status. No JSON schema here — that belongs in TDS and UCS.*

# 5. Background Job Inventory

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<thead>
<tr class="header">
<th><p><strong>Guidance</strong></p>
<p>Job groups: Scheduled (cron) / Event-driven (system event) / Inline check (synchronous). Every job block: attribute table + processing steps + failure behavior table + status line. Write processing steps in plain business language — no SQL or code.</p></th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 5.1 Job Summary Table

| **JOB-ID** | **Job Name**                   | **Group** | **Trigger**      | **FT-ID** | **UC-ID** | **Status** |
|------------|--------------------------------|-----------|------------------|-----------|-----------|------------|
| JOB-01     | Unlock expired locked accounts | Scheduled | Every 15 minutes | FT-05     | UC-02     | ⬜         |
| JOB-02     | Clean up old audit log entries | Scheduled | Daily at 2:00 AM | FT-24     | —         | ⬜         |

## 5.2 JOB-01 — Unlock Expired Locked Accounts

| **Attribute** | **Value**                                                                                                  |
|---------------|------------------------------------------------------------------------------------------------------------|
| FT-ID ref     | FT-05 (Account lockout)                                                                                    |
| Trigger       | Scheduled — every 15 minutes                                                                               |
| UC-ID ref     | UC-02                                                                                                      |
| Purpose       | Automatically unlocks accounts locked after failed sign-in attempts, once the lockout duration has elapsed |

### Processing steps:

- 1\. Find all accounts with status = Locked where the lockout timestamp is more than 10 minutes ago.

- 2\. For each account found: reset the failed sign-in count to zero, set status back to Active.

- 3\. Log the number of accounts unlocked in this run.

### Failure behavior:

| **Scenario**             | **System behavior**                                                                                                                                 |
|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Database unreachable     | Job retries up to 3 times (30-second intervals). On continued failure, logs a critical error. Accounts remain locked until the next successful run. |
| No locked accounts found | Job completes immediately — this is normal. No action taken.                                                                                        |

## 5.3 JOB-02 — Clean Up Old Audit Log Entries

| **Attribute** | **Value**                                                                                                 |
|---------------|-----------------------------------------------------------------------------------------------------------|
| FT-ID ref     | FT-24 (Activity log)                                                                                      |
| Trigger       | Scheduled — daily at 2:00 AM                                                                              |
| UC-ID ref     | —                                                                                                         |
| Purpose       | Removes audit log entries older than the configured retention period to prevent unbounded database growth |

### Processing steps:

- 1\. Determine the configured log retention period (default: 90 days).

- 2\. Find all audit log entries with a timestamp older than the retention threshold.

- 3\. Delete old entries in batches of up to 5,000 records per run — to avoid locking the database.

- 4\. If records remain after one batch, schedule the next batch 5 minutes later.

- 5\. Log the total number of entries deleted and batches processed.

### Failure behavior:

| **Scenario**                    | **System behavior**                                                                                    |
|---------------------------------|--------------------------------------------------------------------------------------------------------|
| Database timeout during delete  | Current batch rolled back. Logs a warning. Tries again at the next scheduled time. No data corruption. |
| Retention period not configured | Uses default of 90 days and logs a warning.                                                            |
