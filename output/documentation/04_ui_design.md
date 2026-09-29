# UI/UX Design Specification: Simple Task Management System (STMS)

**Designer:** Senior UI/UX Designer  
**Project:** STMS MVP  
**Goal:** Maximize task completion rates and user satisfaction through a frictionless, high-contrast, and accessible interface.

---

## 1. User Journey Maps

### 1.1 The "First-Time User" Journey (Onboarding)
**Goal:** Get the user from "Zero to First Task" in under 60 seconds.

| Step | Action | User Emotion | Touchpoint | Design Intent |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Signs up with email/pass | Hopeful | Sign-up Page | Minimize friction; avoid unnecessary fields. |
| 2 | Logs in for first time | Expectant | Login Page | Immediate feedback upon successful auth. |
| 3 | Lands on Dashboard | Curious/Empty | Dashboard | **Empty State:** Use an illustration to guide the user to "Create Task." |
| 4 | Clicks "Add Task" | Focused | Modal/Form | Clear focus states; intuitive "Save" action. |
| 5 | Sees task in list | Satisfied | Task List | Visual confirmation (Toast notification) of success. |

### 1.2 The "Daily Management" Journey (Maintenance)
**Goal:** Efficiently triage and update tasks with minimal clicks.

| Step | Action | User Emotion | Touchpoint | Design Intent |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Reviews Task List | Overwhelmed | Dashboard | Clear typography and spacing to reduce cognitive load. |
| 2 | Filters by "Pending" | Focused | Filter Tabs | Instant UI update (no page reload) using state management. |
| 3 | Marks Task Complete | Accomplished | Checkbox | Tactile feedback (strikethrough + opacity shift). |
| 4 | Edits Task Detail | Intentional | Edit Modal | Contextual editing; "Cancel" button to prevent accidental changes. |
| 5 | Logs out | Finished | Nav Menu | Secure session termination. |

---

## 2. Low-Fidelity Wireframe Layouts

### 2.1 Authentication Pages (Sign-Up/Login)
*Centric layout to focus user attention.*

```markdown
__________________________________________________________
|                                                        |
|                    [ STMS LOGO ]                       |
|                                                        |
|                ____________________                    |
|               |    Welcome Back    |                   |
|               |____________________|                   |
|               |  Email: [_______] |                   |
|               |  Pass:   [_______] |                   |
|               |____________________|                   |
|               |     [ LOGIN ]      |                   |
|               |____________________|                   |
|                                                        |
|               Don't have an account? [Sign Up]         |
|________________________________________________________|
```

### 2.2 Dashboard (Main View)
*A clean, single-column focus for tasks with a persistent "Add" action.*

```markdown
__________________________________________________________
|  STMS Logo        [Search Tasks...]       (User Icon) [Logout] |
|________________________________________________________|
|                                                        |
|  My Tasks                                [ + New Task ] |
|  ____________________________________________________  |
|  |  [All]  [Pending]  [Completed]                     | |
|  |____________________________________________________| |
|                                                        |
|  [ ] Task Title 1 ....................... [Edit] [Del]   |
|  [ ] Task Title 2 ....................... [Edit] [Del]   |
|  [x] ~~Task Title 3 (Completed)~~ ......... [Edit] [Del]   |
|  [ ] Task Title 4 ....................... [Edit] [Del]   |
|                                                        |
|                   ( Load More Tasks )                  |
|________________________________________________________|
```

### 2.3 Task Detail/Edit Modal
*Overlays the dashboard to maintain context.*

```markdown
__________________________________________________________
|                                                        |
|            ________________________________            |
|           | Task Details                [X] |           |
|           |________________________________|           |
|           | Title:                                     |
|           | [ Enter task title...               ]       |
|           |                                             |
|           | Description:                               |
|           | [ Enter detailed notes...           ]       |
|           | [                                   ]       |
|           |                                             |
|           | Status: ( ) Pending  ( ) Completed         |
|           |____________________________________|           |
|           | [ Cancel ]            [ Save Task ] |           |
|           |____________________________________|           |
|                                                        |
|________________________________________________________|
```

---

## 3. Design System Tokens

### 3.1 Color Palette (High Contrast & Accessible)
| Token | Hex Code | Usage | Psychology |
| :--- | :--- | :--- | :--- |
| **Primary** | `#2563EB` | Primary Buttons, Active States | Trust, Focus |
| **Success** | `#16A34A` | Completed Status, Success Toasts | Achievement |
| **Danger** | `#DC2626` | Delete Buttons, Error Borders | Caution, Alert |
| **Neutral-900**| `#111827` | Primary Text, Headings | Stability, Readability |
| **Neutral-500**| `#6B7280` | Secondary Text, Placeholders | Subtle, Unobtrusive |
| **Surface** | `#F9FAFB` | App Background | Cleanliness |
| **White** | `#FFFFFF` | Cards, Modals | Separation |

### 3.2 Typography
*Using a clean Sans-Serif stack (Inter or system-default).*
*   **H1 (Page Title):** 24px | Bold | Line-height: 1.2 | Color: Neutral-900
*   **Body (Standard):** 16px | Regular | Line-height: 1.5 | Color: Neutral-900
*   **Caption/Secondary:** 14px | Regular | Line-height: 1.4 | Color: Neutral-500
*   **Button Text:** 14px | Semi-Bold | Uppercase (Optional) | Color: White

### 3.3 Spacing & Radius
*   **Spacing Scale:** 4px base (4, 8, 16, 24, 32, 64).
*   **Border Radius:** 
    *   `sm` (4px): Checkboxes, Small Inputs.
    *   `md` (8px): Buttons, Cards.
    *   `lg` (12px): Modals, Main Containers.

---

## 4. Accessibility (WCAG 2.1 Guidelines)

To ensure inclusivity and maximize task completion for all users:

1.  **Contrast Ratio:** All text-to-background ratios will exceed **4.5:1** (AA Standard).
2.  **Keyboard Navigation:** 
    *   All interactive elements (inputs, buttons) must have a visible `:focus` ring (Primary blue).
    *   `Tab` order will follow the visual flow (Top $\rightarrow$ Bottom, Left $\rightarrow$ Right).
3.  **Aria Labels:** 
    *   Icon-only buttons (e.g., the "X" to close a modal) must have `aria-label="Close Modal"`.
    *   Form errors must be linked to inputs via `aria-describedby`.
4.  **Visual Cues:** Task completion will not be indicated by color alone (Green); it will include a **strikethrough** and a **checkmark icon**.

---

## 5. Interaction Flow Diagram

### 5.1 Logical Pathing

**Auth Flow:**
`Guest` $\rightarrow$ `Sign Up` $\rightarrow$ `Login` $\rightarrow$ `JWT Storage (LocalStorage/Cookie)` $\rightarrow$ `Dashboard`.

**Task Life Cycle:**
1.  **Create:** `Click [+ New Task]` $\rightarrow$ `Input Data` $\rightarrow$ `POST /tasks` $\rightarrow$ `Update Local State` $\rightarrow$ `Success Toast`.
2.  **Update Status:** `Click Checkbox` $\rightarrow$ `PATCH /tasks/:id` $\rightarrow$ `UI Transition (Strikethrough)` $\rightarrow$ `Optimistic UI Update`.
3.  **Edit:** `Click [Edit]` $\rightarrow$ `Open Modal` $\rightarrow$ `PUT /tasks/:id` $\rightarrow$ `Close Modal` $\rightarrow$ `Refresh List`.
4.  **Delete:** `Click [Delete]` $\rightarrow$ `Confirmation Dialog` $\rightarrow$ `DELETE /tasks/:id` $\rightarrow$ `Animate Row Slide-out` $\rightarrow$ `Remove from DOM`.

### 5.2 Error State Handling
*   **Empty State:** `If (tasks.length === 0)` $\rightarrow$ Render `EmptyStateComponent` (Illustration + "Create Task" button).
*   **Validation Error:** `If (title === "")` $\rightarrow$ Shake animation on input + Red border + Message "Title is required."
*   **Auth Error:** `If (401/403)` $\rightarrow$ Clear token $\rightarrow$ Redirect to `/login` $\rightarrow$ Toast "Session expired. Please login again."