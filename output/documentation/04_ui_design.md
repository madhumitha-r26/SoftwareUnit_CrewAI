# UI/UX Design Specification: Enterprise Task Management System (TMS)

**Designer Notes:** *This specification prioritizes "Cognitive Load Reduction." In an enterprise environment with 10,000+ tasks, the danger is visual noise. My approach utilizes a "Progressive Disclosure" strategy—showing only the information needed for the current task and hiding complex dependency logic until explicitly requested.*

---

## 1. User Journey Maps

### Journey A: The PM’s Dependency Setup (The "Architect" Path)
**Goal:** Map a complex sequence of tasks to ensure no one starts work prematurely.
*   **Entry:** PM opens the Project Dashboard.
*   **Action 1 (Creation):** Clicks "New Task" $\rightarrow$ Inputs details $\rightarrow$ Saves.
*   **Action 2 (Linking):** Opens Task B $\rightarrow$ Navigates to "Dependencies" tab $\rightarrow$ Searches for Task A $\rightarrow$ Selects "Blocked By."
*   **System Feedback:** Task B immediately receives a "Blocked" badge (Amber) on the Kanban board.
*   **Emotional State:** Focus $\rightarrow$ Caution (Ensuring logic is correct) $\rightarrow$ Satisfaction (Visual confirmation of the link).

### Journey B: The Developer’s Daily Sprint (The "Execution" Path)
**Goal:** Move tasks to 'Done' as efficiently as possible.
*   **Entry:** Developer logs in $\rightarrow$ Lands on Kanban Board.
*   **Action 1 (Filtering):** Filters board by "Assigned to Me."
*   **Action 2 (Attempted Move):** Tries to drag a "Blocked" task to 'In Progress'.
*   **System Feedback:** Task snaps back; a toast notification appears: *"Cannot move: This task is blocked by [Task A]."*
*   **Action 3 (Completion):** Drags an unblocked task to 'Review'.
*   **Emotional State:** Determination $\rightarrow$ Frustration (Blocker) $\rightarrow$ Relief (Clear path to completion).

---

## 2. Low-Fidelity Wireframe Layouts

### 2.1 Global Navigation Shell (Common to all views)
```text
_______________________________________________________________________________
| [TMS LOGO]  | Search Tasks... (Ctrl+K)          | [Notifications] [User Profile] |
|_____________|__________________________________|_______________________________|
|             |                                                                   |
|  Dashboard  |  < Breadcrumb: Projects / Project Alpha / Kanban Board >          |
|  Projects   |__________________________________________________________________|
|  Users      |                                                                   |
|  Reports    |                   (Main Content Area)                              |
|  Settings   |                                                                   |
|_____________|__________________________________________________________________|
```

### 2.2 Kanban Board (The Engine)
```text
[ + New Task ] [ Filter: Me v ] [ Sort: Priority v ] [ View: Kanban ]

| TO-DO                | IN PROGRESS          | REVIEW              | DONE               |
|----------------------|---------------------|---------------------|-------------------|
| [ Task 101 ]        | [ Task 104 ]        | [ Task 106 ]        | [ Task 100 ]       |
| Priority: High      | Priority: Med       | Priority: High      | Priority: Low      |
| User: JD            | User: AS            | User: JD            | User: AS           |
| [!] Blocked         |                     |                     |                   |
|----------------------|---------------------|---------------------|-------------------|
| [ Task 102 ]        | [ Task 105 ]        |                     |                   |
| Priority: Low       | Priority: High      |                     |                   |
| User: AS            | User: JD            |                     |                   |
|----------------------|---------------------|---------------------|-------------------|
```

### 2.3 Task Detail Modal (The Control Center)
```text
_______________________________________________________
| Task TMS-101: API Implementation            [ X Close ] |
|_______________________________________________________|
| Status: [ To-Do v ]  Priority: [ High v ]  Assignee: [ JD v ] |
|                                                       |
| Description:                                          |
| [ Enter detailed technical requirements here...      ] |
|                                                       |
| ----------------------------------------------------- |
| Dependencies:                                         |
| [ + Add Dependency ]                                  |
| (i) Blocked By: TMS-99: API Design [ Remove ]          |
| (i) Blocks: TMS-105: Frontend Integration              |
| ----------------------------------------------------- |
| [ Cancel ]                                [ Save Changes ] |
|_______________________________________________________|
```

---

## 3. Design System Tokens

### 3.1 Color Palette (Psychology-Driven)
*   **Primary (Action):** `#2563EB` (Royal Blue) — Evokes trust, stability, and professional focus.
*   **Success (Done):** `#059669` (Emerald Green) — Clear completion signal.
*   **Warning (Blocked):** `#D97706` (Amber) — Alerts user to a pause without signaling "Error."
*   **Danger (Critical/Error):** `#DC2626` (Crimson) — Used for circular dependency alerts.
*   **Neutral (Backgrounds):**
    *   Surface: `#F8FAFC` (Cool Gray)
    *   Border: `#E2E8F0`
    *   Text Primary: `#1E293B` (Deep Slate)

### 3.2 Typography
*   **Primary Font:** *Inter* (Sans-Serif) — Optimized for readability on screens.
*   **Scale:**
    *   H1 (Page Titles): `24px / Bold / 1.2 line-height`
    *   H2 (Section Headers): `18px / Semi-Bold / 1.4 line-height`
    *   Body (Task Content): `14px / Regular / 1.5 line-height`
    *   Caption (Metadata): `12px / Medium / 1.2 line-height`

### 3.3 Spacing & Grid
*   **Base Unit:** `4px`
*   **Standard Padding:** `16px` (4 units)
*   **Card Gap:** `12px` (3 units)
*   **Border Radius:** `6px` (Softened corners for a modern enterprise feel).

---

## 4. Accessibility (WCAG 2.1) Guidelines

| Feature | Guideline | Implementation |
| :--- | :--- | :--- |
| **Contrast** | Level AA | All text-to-background ratios must be $\geq$ 4.5:1. |
| **Navigation** | Keyboard-only | All Kanban actions (Move, Open, Edit) must be accessible via `Tab` and `Enter/Space`. |
| **Visual Cues** | Redundancy | Do not rely on color alone for "Blocked" status; include an icon `(!)` and a text label. |
| **Screen Readers** | ARIA Labels | Kanban columns must be marked as `role="region"` with `aria-label="Column: To-Do"`. |
| **Error State** | Clear Feedback | Circular dependency errors must be announced via `aria-live="assertive"`. |

---

## 5. Interaction Flow Diagrams

### 5.1 State Machine Logic (Task Transition)
`Start` $\rightarrow$ `To-Do` $\rightarrow$ `In Progress` $\rightarrow$ `Review` $\rightarrow$ `Done` $\rightarrow$ `End`

**Logic Constraints:**
1.  **Blocked Check:** If `Task.isBlocked == true`, disable transition to `In Progress`.
2.  **Sequence Check:** If `TargetState == Done` AND `CurrentState != Review`, trigger: *"Please move task to Review first."*
3.  **Dependency Trigger:** If `Task.status` updates to `Done` $\rightarrow$ Search `DependentTasks` $\rightarrow$ Change `BlockedStatus` to `false` $\rightarrow$ Send Notification to `Assignee`.

### 5.2 RBAC Interaction Flow
1.  **User Action** $\rightarrow$ **API Middleware** $\rightarrow$ **Role Check**
2.  **If Role == `Viewer`**:
    *   `UI Action (Drag)` $\rightarrow$ `Intercept` $\rightarrow$ `Prevent Action` $\rightarrow$ `Show Tooltip: "Read-only access"`.
3.  **If Role == `Editor`**:
    *   `UI Action (Drag)` $\rightarrow$ `Allow` $\rightarrow$ `Update DB` $\rightarrow$ `Push WebSocket Update to all clients`.
4.  **If Role == `Admin`**:
    *   `Access User Management` $\rightarrow$ `Modify Role` $\rightarrow$ `Force Refresh User Session`.