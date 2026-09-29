# Project Plan: Simple Task Management System (STMS)

**Project Manager:** Rose  
**Objective:** Deliver a scalable, intuitive, and secure Task Management System on time and within budget, focusing on core CRUD functionality and high system reliability.

---

## 1. Milestone Timeline
The project is scheduled for a **4-week rapid delivery cycle** to achieve a Minimum Viable Product (MVP).

| Milestone | Phase | Key Deliverables | Timeline | Status |
| :--- | :--- | :--- | :--- | :--- |
| **M1: Foundation** | Design & Setup | DB Schema, API Scaffolding, Auth System, Environment Setup | Week 1 | 📅 Planned |
| **M2: Core Engine** | Backend Dev | Task CRUD Endpoints, Filtering/Sorting Logic, API Documentation | Week 2 | 📅 Planned |
| **M3: User Interface** | Frontend Dev | Responsive Dashboard, Task Forms, API Integration, State Mgmt | Week 3 | 📅 Planned |
| **M4: Hardening** | QA & Launch | End-to-End Testing, Bug Fixing, CI/CD Pipeline, Production Deploy | Week 4 | 📅 Planned |

---

## 2. Resource Allocation Breakdown
To maintain lean operations and prevent "bloat," the following resource distribution is allocated:

### Personnel
| Role | Primary Focus | Allocation | Key Responsibility |
| :--- | :--- | :--- | :--- |
| **Project Manager (Rose)** | Coordination & Blockers | 50% | Timeline tracking, stakeholder alignment, risk mitigation. |
| **Backend Developer** | API & Data Integrity | 100% | NestJS implementation, PostgreSQL schema, JWT Security. |
| **Frontend Developer** | UX & Integration | 100% | React/Tailwind UI, TanStack Query integration, Responsive design. |
| **QA Engineer** | Validation | 50% (Wk 3-4) | Functional testing, Regression, Performance validation. |
| **DevOps Engineer** | Infrastructure | 25% (Wk 1 & 4) | AWS Setup, GitHub Actions pipeline, Deployment. |

### Technical Stack
*   **Frontend:** React, Tailwind CSS, Vite, TanStack Query.
*   **Backend:** Node.js, TypeScript, NestJS.
*   **Database:** PostgreSQL (via Prisma ORM).
*   **Infrastructure:** AWS (ECS Fargate/RDS), Vercel, GitHub Actions.

---

## 3. Critical Path Analysis
The critical path identifies the sequence of tasks that must be completed on time to prevent a project delay.

**Path: DB Schema $\rightarrow$ Auth Implementation $\rightarrow$ Task CRUD API $\rightarrow$ Frontend Integration $\rightarrow$ QA $\rightarrow$ Deployment.**

*   **High-Risk Dependency:** The Frontend Developer cannot begin meaningful integration (M3) until the Backend Developer delivers the API Contract and Auth endpoints (M1/M2).
*   **Bottleneck Mitigation:** To prevent the Frontend Developer from idling in Week 2, they will work on **UI Mockups and Static Components** using a mock API (JSON Server) while the actual backend is being built.
*   **Critical Constraint:** The database schema must be finalized by Day 3. Any change to the `Task` entity after Week 2 will cause a cascading delay in both Frontend and QA phases.

---

## 4. Risk-Mitigation Register

| Category | Risk | Impact | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Scope** | **Scope Creep:** Stakeholders request "Advanced Features" (e.g., Calendar view, Collaborators) mid-sprint. | High | High | **Strict MVP Freeze:** Any new feature requests are moved to a "Version 2.0" backlog. Only critical bugs are addressed in the current cycle. |
| **Technical** | **Performance Lag:** Dashboard slows down as the number of tasks increases. | Medium | Low | **Indexing & Pagination:** Implement DB indexing on `user_id` and `title`. Use API pagination to ensure the frontend never loads $>100$ tasks at once. |
| **Security** | **Data Leakage:** Users accessing tasks of other users via IDOR (URL manipulation). | Critical | Medium | **Middleware Validation:** Implement a strict ownership check in the NestJS service layer: `WHERE task.id = :id AND task.user_id = :currentUser`. |
| **Timeline** | **Integration Friction:** Frontend and Backend types mismatch during Week 3. | Medium | Medium | **TypeScript Shared Types:** Use a shared interface library or Prisma-generated types to ensure the API contract is strictly enforced on both ends. |
| **Infrastructure**| **Deployment Failure:** Issues with AWS environment configuration during final launch. | High | Low | **Early Staging:** Deploy a "Hello World" version to the staging environment in Week 1 to validate the CI/CD pipeline immediately. |