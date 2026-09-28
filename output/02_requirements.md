# Business Requirements Document (BRD): Simple Task Management System (STMS)

**Version:** 1.0  
**Status:** Final for Development  
**Author:** Business Analyst  
**Project Goal:** Deliver a functional MVP allowing users to perform CRUD operations on tasks with status tracking.

---

## 1. Executive Summary
The Simple Task Management System (STMS) is designed to replace fragmented task tracking with a centralized digital interface. The focus of this MVP is **stability and core utility**: creating, reading, updating, and deleting tasks, and transitioning those tasks through a defined lifecycle (Status tracking). To avoid scope creep, advanced features (Calendar, Notifications, File Attachments) are explicitly excluded from this version.

---

## 2. End-to-End User Workflows

### Workflow A: The Task Lifecycle (Happy Path)
1. **Authentication:** User logs into the system.
2. **Creation:** User clicks "New Task," enters a title and description, and saves.
3. **Organization:** User views the task on the dashboard in the "To Do" column/filter.
4. **Execution:** User begins working on the task and updates the status to "In Progress."
5. **Completion:** User finishes the task and updates the status to "Completed."
6. **Cleanup:** User deletes the task once it is no longer needed for records.

### Workflow B: Task Management & Refinement
1. **Review:** User logs in and filters the dashboard to see only "In Progress" tasks.
2. **Modification:** User realizes the task description is incomplete; they open the edit modal, update the text, and save.
3. **Verification:** User confirms the updated text is reflected on the main dashboard.

---

## 3. Functional Requirements & User Stories

### 3.1 User Authentication & Access
*Goal: Ensure data integrity by restricting task access to registered users.*

| ID | User Story | Priority | Acceptance Criteria (Gherkin) |
| :--- | :--- | :--- | :--- |
| **US.1** | As a user, I want to log into the system so that I can access my private task list. | P0 | **Given** I am on the login page<br>**When** I enter valid credentials<br>**Then** I should be redirected to the Task Dashboard. |
| **US.2** | As a user, I want to be prevented from accessing the dashboard without logging in. | P0 | **Given** I am not authenticated<br>**When** I attempt to access `/dashboard`<br>**Then** I should be redirected to the login page with an error message. |

### 3.2 Task Management (CRUD)
*Goal: Provide the core ability to manage the lifecycle of a task.*

| ID | User Story | Priority | Acceptance Criteria (Gherkin) |
| :--- | :--- | :--- | :--- |
| **US.3** | As a user, I want to create a new task with a title and description. | P0 | **Given** I am on the dashboard<br>**When** I fill in a mandatory "Title" and an optional "Description" and click save<br>**Then** the task should appear in the list with a default status of "To Do." |
| **US.4** | As a user, I want to view a list of all my tasks. | P0 | **Given** I am logged in<br>**When** I land on the dashboard<br>**Then** I should see a list of all tasks containing the Title, Status, and Created Date. |
| **US.5** | As a user, I want to edit the details of an existing task. | P1 | **Given** a task exists in the list<br>**When** I click "Edit," change the title/description, and save<br>**Then** the changes should be persisted and reflected in the UI immediately. |
| **US.6** | As a user, I want to delete a task. | P1 | **Given** a task exists<br>**When** I click "Delete" and confirm the action<br>**Then** the task should be removed from my active view (Soft Delete). |

### 3.3 Status Tracking & Filtering
*Goal: Allow users to track progress and organize their workload.*

| ID | User Story | Priority | Acceptance Criteria (Gherkin) |
| :--- | :--- | :--- | :--- |
| **US.7** | As a user, I want to change the status of a task. | P0 | **Given** a task exists<br>**When** I select a new status (e.g., "To Do" $\rightarrow$ "In Progress" $\rightarrow$ "Completed")<br>**Then** the task status should update in the database and UI. |
| **US.8** | As a user, I want to filter tasks by their status. | P1 | **Given** I have tasks in various statuses<br>**When** I select the "Completed" filter<br>**Then** only tasks with the status "Completed" should be visible. |

---

## 4. Edge Cases & Error Handling

| Scenario | Requirement / Expected Behavior |
| :--- | :--- |
| **Empty State** | When a new user logs in with zero tasks, the dashboard must display a "No tasks found. Create your first task!" empty-state illustration/message instead of a blank screen. |
| **Missing Mandatory Fields** | If a user attempts to save a task without a "Title," the system must block the API request and highlight the field in red with the message: *"Title is required."* |
| **Excessive Text Length** | If a user enters a title exceeding 255 characters, the UI should truncate the text with ellipses (...) and the API should return a `400 Bad Request` for validation. |
| **Concurrent Edits** | If a user has two tabs open and edits the same task in both, the final save (last request to hit the server) wins. (Standard MVP behavior). |
| **Accidental Deletion** | Per the Risk Register, tasks must not be hard-deleted. The system must set a `deleted_at` timestamp. The UI should provide a "Confirm Delete" pop-up to prevent accidental clicks. |

---

## 5. Technical Constraints & Non-Functional Requirements

*   **Performance:** The task list must load in under 2 seconds for lists up to 1,000 items (mitigated by database indexing on `status`).
*   **API Contract:** All communication between the React frontend and NestJS backend must follow the signed-off OpenAPI/Swagger specification.
*   **Data Integrity:** Tasks must be linked to a `user_id`. Users must never be able to view or edit tasks belonging to another `user_id` via API manipulation (IDOR protection).
*   **Responsiveness:** The UI must be functional on both Desktop and Tablet resolutions using Tailwind CSS.

---

## 6. Traceability Matrix (MVP Boundary)

| Feature | Included in MVP? | Deferred to V2.0 |
| :--- | :--- | :--- |
| User Login/Auth | ✅ Yes | - |
| Task CRUD | ✅ Yes | - |
| Status Transitions | ✅ Yes | - |
| Status Filtering | ✅ Yes | - |
| Soft Deletes | ✅ Yes | - |
| Calendar View | ❌ No | Backlog |
| Email Notifications | ❌ No | Backlog |
| File Attachments | ❌ No | Backlog |
| Multi-user Collaboration | ❌ No | Backlog |