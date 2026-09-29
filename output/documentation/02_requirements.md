# Business Requirements Document (BRD): Simple Task Management System (STMS)

**Version:** 1.0  
**Status:** Final for Development  
**Author:** Business Analyst  
**Date:** October 26, 2023

---

## 1. Executive Summary
The Simple Task Management System (STMS) is a lean, secure MVP designed to allow users to manage their daily tasks efficiently. The primary goal is to provide a high-reliability CRUD (Create, Read, Update, Delete) application that ensures strict data isolation between users. This document serves as the single source of truth for the development team to prevent scope creep and integration friction.

## 2. User Workflows (End-to-End)

### 2.1 The "First-Time User" Flow
`Sign Up` $\rightarrow$ `Login` $\rightarrow$ `Land on Empty Dashboard` $\rightarrow$ `Create First Task` $\rightarrow$ `View Task in List`.

### 2.2 The "Daily Management" Flow
`Login` $\rightarrow$ `Review Task List` $\rightarrow$ `Filter by Status (Pending/Completed)` $\rightarrow$ `Mark Task as Complete` $\rightarrow$ `Edit Task Detail` $\rightarrow$ `Logout`.

### 2.3 The "Cleanup" Flow
`Login` $\rightarrow$ `Search for Old Task` $\rightarrow$ `Delete Task` $\rightarrow$ `Verify Task no longer exists in list`.

---

## 3. Functional Requirements & User Stories

### 3.1 Authentication & User Management (Foundation)
**Priority: P0 (Critical)**

| ID | User Story | Acceptance Criteria (Gherkin Syntax) |
| :--- | :--- | :--- |
| **US.1** | As a user, I want to create an account so that I can save my tasks privately. | **Given** I am on the Sign-Up page<br>**When** I enter a valid email and password<br>**Then** a new user record is created in PostgreSQL and I am redirected to the Login page. |
| **US.2** | As a user, I want to log in securely so that I can access my personal task list. | **Given** I have a registered account<br>**When** I provide correct credentials<br>**Then** the system issues a JWT and redirects me to the Dashboard. |
| **US.3** | As a user, I want my session to be protected so that others cannot see my tasks. | **Given** I am not authenticated<br>**When** I try to access the `/dashboard` route<br>**Then** I am redirected to the Login page with an "Unauthorized" message. |

### 3.2 Task Management - Core CRUD (Core Engine)
**Priority: P0 (Critical)**

| ID | User Story | Acceptance Criteria (Gherkin Syntax) |
| :--- | :--- | :--- |
| **US.4** | As a user, I want to create a task so that I can track what I need to do. | **Given** I am logged in and on the Dashboard<br>**When** I fill in the task title and description and click "Save"<br>**Then** the task is persisted to the DB and appears immediately in my list. |
| **US.5** | As a user, I want to view a list of my tasks so that I can organize my day. | **Given** I have existing tasks<br>**When** I load the Dashboard<br>**Then** I see a list of all my tasks, including title and current status. |
| **US.6** | As a user, I want to edit an existing task so that I can update details or deadlines. | **Given** I have an existing task<br>**When** I modify the title or description and save<br>**Then** the changes are updated in the DB and reflected in the UI. |
| **US.7** | As a user, I want to delete a task so that I can remove irrelevant items. | **Given** I have a task I no longer need<br>**When** I click the "Delete" button and confirm<br>**Then** the task is removed from the DB and disappears from the UI. |
| **US.8** | As a user, I want to toggle a task as "Complete" or "Pending". | **Given** I have a task in my list<br>**When** I click the status checkbox/toggle<br>**Then** the `status` field updates in the DB and the UI reflects the change (e.g., strikethrough). |

### 3.3 Task Organization & Optimization (UI/UX)
**Priority: P1 (High)**

| ID | User Story | Acceptance Criteria (Gherkin Syntax) |
| :--- | :--- | :--- |
| **US.9** | As a user, I want to filter tasks by status so that I can focus on what is left to do. | **Given** I have a mix of completed and pending tasks<br>**When** I select the "Pending" filter<br>**Then** only tasks with `status = 'Pending'` are displayed. |
| **US.10** | As a user, I want my tasks to be paginated so that the app remains fast. | **Given** I have more than 100 tasks<br>**When** I load the Dashboard<br>**Then** the API returns only the first 100 records, and I can load more via pagination/scrolling. |

---

## 4. Non-Functional Requirements

### 4.1 Security (The "Anti-Leak" Requirements)
*   **IDOR Prevention:** The backend MUST validate ownership of the resource. 
    *   *Requirement:* Every `GET`, `PUT`, and `DELETE` request must include a clause: `WHERE task.id = :id AND task.user_id = :currentUserId`.
*   **Authentication:** All API endpoints (except `/auth/login` and `/auth/signup`) must be guarded by a JWT Strategy middleware.
*   **Data Integrity:** Passwords must be hashed using bcrypt before being stored in the PostgreSQL database.

### 4.2 Performance & Scalability
*   **Database Indexing:** B-tree indexes must be applied to `user_id` and `created_at` columns to ensure $O(log n)$ lookup times as the user base grows.
*   **Frontend State:** Use TanStack Query for caching to prevent redundant API calls when navigating between the Dashboard and Task Edit views.

### 4.3 Availability & Deployment
*   **CI/CD:** Every merge to the `main` branch must trigger a GitHub Action that runs tests and deploys to AWS ECS Fargate.
*   **Responsiveness:** The UI must be fully functional on screen widths from 375px (Mobile) to 1920px (Desktop) using Tailwind CSS breakpoints.

---

## 5. Edge Cases & Error Handling

| Scenario | Expected System Behavior |
| :--- | :--- |
| **Empty State** | If a user has 0 tasks, the Dashboard must display a "No tasks found. Create your first one!" illustration/message instead of a blank screen. |
| **Invalid Task ID** | If a user manually enters a Task ID in the URL that doesn't exist, the system returns a `404 Not Found` and a user-friendly toast message. |
| **Unauthorized Access** | If a user tries to edit a Task ID belonging to another user, the system returns `403 Forbidden` and logs a security warning. |
| **Network Failure** | If the API is unreachable, the Frontend must display an "Offline" banner and disable "Save" buttons to prevent data loss. |
| **Input Validation** | If a user attempts to save a task with an empty title, the UI must prevent submission and highlight the field in red. |

---

## 6. Technical Constraints Summary (for Engineers)
*   **DB Schema Lock:** No changes to the `Task` entity after Week 2.
*   **Contract:** Frontend and Backend must adhere to the shared TypeScript interfaces to avoid integration friction.
*   **MVP Freeze:** Features such as "Calendar View," "Collaborators," or "Due Date Reminders" are strictly excluded from this release and moved to the V2.0 Backlog.