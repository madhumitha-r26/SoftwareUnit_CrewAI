# UI/UX Design Specification: Simple Task Management System (STMS)

**Designer Note:** To maximize user satisfaction and task completion, this design avoids "feature bloat." By leveraging a clean, high-contrast interface and a logical information hierarchy, we reduce cognitive load, allowing users to focus entirely on their productivity.

---

## 1. User Journey Maps

### Workflow A: The Task Lifecycle (Creation to Cleanup)
**Goal:** Move a task from ideation to completion and eventual archival.

| Phase | Action | User Emotion | UI Touchpoint | System Response |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | Enters credentials | Focused | Login Screen | Validates JWT; redirects to Dashboard. |
| **Create** | Clicks "+ New Task" $\rightarrow$ Enters Title $\rightarrow$ Saves | Hopeful | Task Modal | Validates mandatory title; adds task to "To Do." |
| **Organize** | Views dashboard list | Organized | Dashboard Table | Displays task with "To Do" badge. |
| **Execute** | Changes status to "In Progress" | Productive | Status Dropdown | Updates DB; changes badge color to Yellow/Blue. |
| **Complete** | Changes status to "Completed" | Satisfied | Status Dropdown | Updates DB; changes badge color to Green. |
| **Cleanup** | Clicks Delete $\rightarrow$ Confirms | Relieved | Delete Button $\rightarrow$ Modal | Triggers soft-delete; removes from view. |

### Workflow B: Management & Refinement
**Goal:** Audit existing work and correct information.

| Phase | Action | User Emotion | UI Touchpoint | System Response |
| :--- | :--- | :--- | :--- | :--- |
| **Review** | Selects "In Progress" filter | Analytical | Filter Chip/Dropdown | Hides "To Do" and "Completed" tasks. |
| **Modify** | Clicks "Edit" $\rightarrow$ Updates Description | Diligent | Edit Modal | Opens pre-filled form; saves changes. |
| **Verify** | Views updated task in list | Confident | Dashboard Table | Reflects updated text immediately. |

---

## 2. Low-Fidelity Wireframe Layouts

### Screen 1: Login Page
*Centered card layout to minimize distractions.*

```text
_____________________________________________________________
|                                                           |
|                    [ STMS LOGO ]                          |
|                                                           |
|                ___________________________                |
|               |        Welcome Back       |               |
|               |  _______________________  |               |
|               | | Email Address        | |               |
|               | |_______________________| |               |
|               |  _______________________  |               |
|               | | Password            | |               |
|               | |_______________________| |               |
|               |                           |               |
|               |      [ LOGIN BUTTON ]      |               |
|               |___________________________|               |
|                                                           |
|___________________________________________________________|
```

### Screen 2: Main Dashboard
*A "Clean Slate" approach. Top bar for global actions, center for data.*

```text
_________________________________________________________________________
| [STMS]          Search tasks...          [User Profile] [Logout]      |
|_______________________________________________________________________|
|                                                                       |
|  My Tasks                       [ + NEW TASK ]                        |
|                                                                       |
|  Filter by: ( All )  ( To Do )  ( In Progress )  ( Completed )        |
|                                                                       |
|  ___________________________________________________________________  |
|  | Title                | Status         | Date Created | Actions   |  |
|  |---------------------|----------------|--------------|-----------|  |
|  | Fix Login Bug       | [ In Progress ] | 2023-10-01   | [Edit][Del]|  |
|  | Update Docs        | [ To Do ]       | 2023-10-02   | [Edit][Del]|  |
|  | Setup Database     | [ Completed ]  | 2023-09-28   | [Edit][Del]|  |
|  |_____________________|_________________|______________|___________|  |
|                                                                       |
|  (Empty State: "No tasks found. Create your first task!" + Illustration)|
|_______________________________________________________________________|
```

### Screen 3: Task Modal (Create/Edit)
*Overlay modal to maintain context of the dashboard.*

```text
_____________________________________
|          Task Details          [X] |
|____________________________________|
|                                    |
|  Title *                           |
|  [_______________________________] |
|  (Error: Title is required)        |
|                                    |
|  Description                       |
|  [                               ] |
|  [_______________________________] |
|                                    |
|  Status                            |
|  ( To Do / In Progress / Completed )|
|                                    |
|            [ Cancel ] [ Save ]    |
|____________________________________|
```

---

## 3. Design System Tokens

### A. Color Palette (Psychology-Driven)
*Focus: Clarity, trust, and status-at-a-glance.*

| Token | Hex Code | Usage | Psychology |
| :--- | :--- | :--- | :--- |
| **Primary** | `#2563EB` | Buttons, Active States, Branding | Trust & Professionalism |
| **Success** | `#16A34A` | "Completed" status, Success alerts | Achievement & Completion |
| **Warning** | `#CA8A04` | "In Progress" status | Caution/Attention |
| **Danger** | `#DC2626` | Delete buttons, Error messages | Urgency/Warning |
| **Neutral-100**| `#F9FAFB` | Page Background | Cleanliness/Breathability |
| **Neutral-800**| `#1F2937` | Primary Text, Headers | High Contrast/Readability |

### B. Typography
*Focus: Legibility and hierarchy.*

*   **Primary Font:** `Inter` or `System Sans-Serif` (Highly legible on screens).
*   **H1 (Page Title):** 24px / Semi-Bold / Neutral-800.
*   **Body (Table/Form):** 14px / Regular / Neutral-600.
*   **Label (Small):** 12px / Medium / Neutral-500.
*   **Button Text:** 14px / Medium / White.

### C. Spacing & Grid
*Based on an 8px soft-grid system to ensure visual coherence.*

*   **Page Margin:** 32px (Desktop), 16px (Tablet).
*   **Component Gap:** 16px (Standard spacing between form fields).
*   **Border Radius:** 6px (Modern, soft professional look).
*   **Table Padding:** 12px vertical / 16px horizontal.

---

## 4. Accessibility (WCAG 2.1) Guidelines

To ensure the STMS is usable by everyone, the following guidelines are mandatory:

### 1. Visual Contrast
*   **Contrast Ratio:** All text-to-background ratios must be at least **4.5:1** (AA Standard).
*   **Status Badges:** Do not rely on color alone. "Completed" should have a checkmark icon $\checkmark$ and the word "Completed" to support color-blind users.

### 2. Keyboard Navigation
*   **Focus Indicators:** All interactive elements (Inputs, Buttons) must have a visible `:focus` ring (2px solid Primary blue).
*   **Tab Order:** Logical flow from Top $\rightarrow$ Bottom, Left $\rightarrow$ Right.
*   **Modal Trap:** When the Task Modal is open, the `Tab` key must cycle only within the modal and not "leak" to the dashboard background.

### 3. Screen Reader Support (ARIA)
*   **Form Labels:** Every input must have a linked `<label>` tag.
*   **Error Handling:** Use `aria-invalid="true"` and `aria-describedby="error-msg-id"` when the Title field is missing.
*   **Landmarks:** Use `<main>`, `<nav>`, and `<table>` tags to allow screen readers to jump to specific sections.

### 4. Error Prevention
*   **Confirmation:** The "Delete" action must trigger a confirmation modal to prevent accidental data loss, meeting the "Error Prevention" criterion of WCAG.