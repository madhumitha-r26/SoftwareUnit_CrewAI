# Project Plan: Simple Task Management System (STMS)

**Project Manager:** Rose
**Project Goal:** Deliver a functional, stable MVP of a Task Management System that allows users to perform CRUD operations on tasks with status tracking, delivered on time and within scope.

---

## 1. Milestone Timeline
This timeline assumes a 6-week development cycle to reach MVP.

| Milestone | Phase | Key Deliverables | Timeline | Dependency |
| :--- | :--- | :--- | :--- | :--- |
| **M1: Foundation** | Planning & Setup | Requirements Doc, Arch Blueprint, Dev Env Setup | Week 1 | None |
| **M2: Core API** | Backend Dev | User Auth, Task CRUD API, Database Schema | Week 2-3 | M1 |
| **M3: User Interface** | Frontend Dev | Task Dashboard, Create/Edit Modals, Status Filters | Week 3-4 | M2 (Partial) |
| **M4: Integration** | System Sync | Frontend-Backend Connection, End-to-End Testing | Week 5 | M2, M3 |
| **M5: Hardening** | QA & Polishing | Bug Fixes, Performance Tuning, Final UAT | Week 6 | M4 |
| **M6: Deployment** | Release | Production Environment, Live Application | End of W6 | M5 |

---

## 2. Resource Allocation Breakdown
To maintain a lean MVP, the team is structured to cover all critical technical bases without overlap.

| Role | Allocation | Primary Responsibilities | Key Focus Area |
| :--- | :--- | :--- | :--- |
| **Project Manager** | 25% | Timeline tracking, blocker removal, stakeholder sync | Scope Control |
| **Business Analyst**| 20% | Requirement validation, UAT criteria, user stories | Feature Accuracy |
| **Solution Architect**| 15% | Schema design, API contracts, infra oversight | System Stability |
| **Backend Developer**| 100% | NestJS API, PostgreSQL implementation, Auth logic | Data Integrity |
| **Frontend Developer**| 100% | React/Tailwind UI, State management, API integration | User Experience |
| **QA Engineer** | 50% | Integration testing, Bug reporting, Regression | Quality Gate |
| **DevOps Engineer** | 30% | Dockerization, AWS Pipeline, CI/CD setup | Deployment |

---

## 3. Critical Path Analysis
The critical path represents the sequence of stages that cannot be delayed without delaying the entire project.

**Path: Requirements $\rightarrow$ DB Schema $\rightarrow$ Backend API $\rightarrow$ Frontend Integration $\rightarrow$ QA $\rightarrow$ Deployment**

*   **The Bottleneck:** The **Backend API** is the primary dependency. The Frontend Developer can build "mock" interfaces in Week 3, but actual integration (M4) cannot occur until the API endpoints are stable.
*   **Risk to Path:** Any change in the Data Model (Solution Architect) during Week 3 will trigger a ripple effect, requiring both Backend and Frontend updates, potentially pushing the deployment date.
*   **Optimization:** To mitigate this, we use **API Contracts** (Swagger/OpenAPI). Once the contract is signed off in Week 1, Frontend and Backend can work in parallel.

---

## 4. Risk-Mitigation Register

| Category | Risk Description | Impact | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Scope** | "Scope Creep": Stakeholders requesting "just one more feature" (e.g., Calendar view). | High | High | **Strict MVP Boundary:** All new requests are added to a "Version 2.0 Backlog" and deferred until after M6. |
| **Technical** | API mismatch between Frontend and Backend. | Medium | Medium | **Contract-First Development:** Use Swagger documentation to agree on request/response bodies before coding. |
| **Resource** | Single point of failure (e.g., Backend Dev falls ill). | High | Low | **Cross-Documentation:** All code must be pushed to Git daily with clear commit messages and READMEs. |
| **Performance** | Slow load times as task list grows to 1,000+ items. | Medium | Low | **Indexing & Pagination:** Solution Architect has already specified indexing on `status` and `assignee_id`. |
| **Quality** | Users accidentally deleting tasks without recovery. | Medium | Medium | **Soft Deletes:** Implement `deleted_at` timestamps instead of hard deletes to allow for "Undo" functionality. |