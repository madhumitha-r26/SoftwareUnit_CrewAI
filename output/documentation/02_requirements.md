# Business Requirements Document (BRD): Enterprise Task Management System (TMS)

**Version:** 1.0  
**Status:** Final  
**Author:** Business Analyst  
**Project Manager:** Rose  

---

## 1. Executive Summary
The Enterprise Task Management System (TMS) is designed to replace fragmented task tracking with a centralized, scalable platform. The system focuses on three core pillars: **Rigid Governance (RBAC)**, **Visual Workflow (Kanban)**, and **Complex Relationship Mapping (Dependency Tracking)**. The primary goal is to eliminate "blocked" ambiguity and provide leadership with real-time visibility via heatmaps and dashboards.

---

## 2. End-to-End User Workflows

### Workflow A: Task Lifecycle (The Happy Path)
1. **Creation:** A Project Manager (PM) creates a task, assigns a priority, and assigns it to a Developer.
2. **Dependency Mapping:** The PM links the task as "Dependent on" a prerequisite task (e.g., "API Design" must be done before "API Implementation").
3. **Execution:** The Developer moves the task from `To-Do` $\rightarrow$ `In Progress` on the Kanban board.
4. **Validation:** Once finished, the Developer moves the task to `Review`.
5. **Completion:** After QA approval, the task moves to `Done`, which automatically triggers a notification to the owner of the dependent task that their blocker is cleared.

### Workflow B: Access Control & Governance
1. **Onboarding:** An Admin creates a user account and assigns the role `Viewer`.
2. **Restriction:** The User attempts to drag a task on the Kanban board but finds the action disabled.
3. **Escalation:** The Admin updates the role to `Editor`; the User can now modify task states but cannot delete the project.

---

## 3. Functional Requirements & User Stories

### Module 1: Identity & Access Management (IAM/RBAC)
**Goal:** Ensure data integrity and security by restricting actions based on organizational roles.

| ID | User Story | Priority | Acceptance Criteria (Gherkin) |
| :--- | :--- | :---: | :--- |
| **US.1** | As an Admin, I want to assign roles (Admin, Editor, Viewer) to users so that I can control system access. | P0 | **Given** I am logged in as an Admin<br>**When** I navigate to the User Management panel and change a user's role to 'Viewer'<br>**Then** that user should be unable to create or edit tasks. |
| **US.2** | As a User, I want to be authenticated via a secure login so that my private project data is protected. | P0 | **Given** a user provides invalid credentials<br>**When** they attempt to log in<br>**Then** the system should deny access and display a "Invalid credentials" error message. |

---

### Module 2: Task Engine & State Machine
**Goal:** Standardize how tasks move through the lifecycle and prevent illegal state transitions.

| ID | User Story | Priority | Acceptance Criteria (Gherkin) |
| :--- | :--- | :---: | :--- |
| **US.3** | As a User, I want to create, read, update, and delete (CRUD) tasks so that I can manage my workload. | P0 | **Given** I have 'Editor' permissions<br>**When** I submit a task with a Title, Description, and Assignee<br>**Then** the task should be saved to the DB and appear in the project list. |
| **US.4** | As a PM, I want the system to enforce a state machine (e.g., To-Do $\rightarrow$ In Progress $\rightarrow$ Review $\rightarrow$ Done) to maintain process discipline. | P1 | **Given** a task is in 'To-Do' status<br>**When** I attempt to move it directly to 'Done' (skipping Review)<br>**Then** the system should block the transition and prompt the user to follow the workflow. |

---

### Module 3: Dependency Tracking & DAG Logic
**Goal:** Manage complex project interdependencies and prevent system crashes due to circular references.

| ID | User Story | Priority | Acceptance Criteria (Gherkin) |
| :--- | :--- | :---: | :--- |
| **US.5** | As a PM, I want to mark a task as "Blocked by" another task so that the team knows the prerequisite. | P1 | **Given** Task B is dependent on Task A<br>**When** Task A is not in 'Done' status<br>**Then** Task B should be visually flagged as 'Blocked' and restricted from moving to 'In Progress'. |
| **US.6** | As a System, I want to prevent circular dependencies (A $\rightarrow$ B $\rightarrow$ A) to avoid infinite loops and crashes. | P0 | **Given** Task A depends on Task B<br>**When** I attempt to make Task B depend on Task A<br>**Then** the system should reject the update and return a "Circular Dependency Detected" error. |

---

### Module 4: Visualization (Kanban & Dashboards)
**Goal:** Provide high-level visibility and an intuitive interface for daily operations.

| ID | User Story | Priority | Acceptance Criteria (Gherkin) |
| :--- | :--- | :---: | :--- |
| **US.7** | As a Developer, I want to drag-and-drop tasks between columns on a Kanban board for rapid status updates. | P1 | **Given** I am on the Kanban view<br>**When** I drag a task card from 'In Progress' to 'Review'<br>**Then** the task state should update in the backend and reflect across all users' screens in real-time. |
| **US.8** | As an Executive, I want a Heatmap Dashboard showing task density and bottlenecks. | P2 | **Given** a project with 100+ tasks<br>**When** I load the Heatmap Dashboard<br>**Then** I should see a visual representation of which statuses have the highest volume of tasks. |

---

## 4. Edge Cases & Technical Constraints

### 4.1 Edge Case Handling
*   **The "Ghost" Assignee:** If a user is deleted from the system, all tasks assigned to them must be automatically transitioned to "Unassigned" and a notification sent to the Project Manager.
*   **Bulk State Change:** If a "Parent" task is marked as cancelled, the system must prompt the user to either cancel all "Child" (dependent) tasks or re-assign their dependencies.
*   **Concurrent Edits:** If two users edit the same task simultaneously, the system must implement *Optimistic Locking* (the second user to save is notified that the task was updated and must refresh).

### 4.2 Non-Functional Requirements
*   **Performance:** Dashboard aggregation queries must execute in $< 2$ seconds for datasets up to 10,000 tasks (Requirement: Redis Caching).
*   **Availability:** The system must maintain 99.9% uptime via K8s orchestration.
*   **Scalability:** The MongoDB schema must be indexed by `projectId` and `status` to prevent full table scans during Kanban renders.

---

## 5. Traceability Matrix (Critical Path Alignment)

| Critical Path Element | Linked User Story | Risk Mitigation |
| :--- | :--- | :--- |
| **DB Schema Design** | US.3, US.6 | DAG implementation for dependencies. |
| **IAM/RBAC** | US.1, US.2 | Strict role-based API middleware. |
| **State Machine** | US.4, US.5 | Backend validation of status transitions. |
| **Kanban Integration** | US.7 | WebSocket/Real-time updates for DnD. |
| **Dependency Graph** | US.5, US.6 | Directed Acyclic Graph (DAG) validation logic. |
| **Load Testing** | US.8 | k6 testing on Redis cached aggregates. |