As a QA Engineer, my priority is to systematically dismantle the current implementation to ensure it meets the BRD and handles real-world chaos. I have reviewed the NestJS backend and React frontend. 

**Initial QA Audit Observations:**
1. **IDOR Risk:** The backend correctly implements `userId` checks in `update` and `softDelete`. This is a critical win.
2. **Validation Gap:** The backend uses `ValidationPipe`, but the frontend only checks for "Title is required." The 255-character limit mentioned in the BRD is not enforced on the frontend, which will lead to unnecessary `400 Bad Request` API trips.
3. **Soft Delete Logic:** The `findAll` method correctly filters `deletedAt: IsNull()`, ensuring soft-deleted tasks stay hidden.
4. **UX Gap:** The "Empty State" requirement is implemented in `TaskTable.jsx`, satisfying the BRD.

Below is the complete **STMS Quality Assurance Suite**.

---

# 🧪 STMS Quality Assurance Suite

## 1. Test Execution Matrix (Manual)

| Test ID | Requirement | Scenario | Pre-condition | Test Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | US.1 | Valid Login | Registered User | 1. Navigate to login<br>2. Enter valid email/pass<br>3. Click Login | Redirected to `/dashboard`, JWT stored in localStorage. | P0 |
| **TC-02** | US.2 | Unauthenticated Access | No JWT in storage | 1. Directly enter `/dashboard` URL in browser | Redirected to login page with error message. | P0 |
| **TC-03** | US.3 | Task Creation (Happy) | Logged In | 1. Click "New Task"<br>2. Enter Title & Desc<br>3. Save | Task appears in list; Status is "TODO". | P0 |
| **TC-04** | Edge Case | Missing Mandatory Field | Logged In | 1. Click "New Task"<br>2. Leave Title blank<br>3. Save | UI highlights field in red; "Title is required" shown. | P0 |
| **TC-05** | US.7 | Status Transition | Task exists | 1. Edit task<br>2. Change status "TODO" $\rightarrow$ "IN_PROGRESS"<br>3. Save | UI updates immediately; DB reflects change. | P0 |
| **TC-06** | US.8 | Status Filtering | Tasks in all statuses | 1. Click "Completed" filter | Only tasks with status `COMPLETED` are visible. | P1 |
| **TC-07** | US.6 | Soft Delete Confirmation | Task exists | 1. Click "Delete" | Browser confirmation popup appears before deletion. | P1 |
| **TC-08** | Edge Case | Excessive Text Length | Logged In | 1. Enter Title > 255 chars<br>2. Save | API returns 400; UI displays validation error. | P2 |
| **TC-09** | Security | IDOR Attack (API) | User A & User B logged in | 1. User A captures `PATCH /tasks/{UserB_ID}`<br>2. Sends request via Postman | Backend returns `403 Forbidden`. | P0 |
| **TC-10** | Edge Case | Empty State | New User (0 tasks) | 1. Log in | "No tasks found. Create your first task!" displayed. | P2 |

---

## 2. Automated Test Scripts

### A. Backend API Tests (Pytest + Requests)
*Focus: Contract validation, Security, and Data Integrity.*

```python
import pytest
import requests

BASE_URL = "http://localhost:3000/api/v1"
USER_A_TOKEN = "jwt_token_user_a"
USER_B_TOKEN = "jwt_token_user_b"
TASK_ID_B = "uuid-of-user-b-task"

def test_create_task_missing_title():
    headers = {"Authorization": f"Bearer {USER_A_TOKEN}"}
    payload = {"description": "No title here"}
    response = requests.post(f"{BASE_URL}/tasks", json=payload, headers=headers)
    assert response.status_code == 400
    assert "title" in response.text

def test_idor_prevention_update():
    # User A attempts to update User B's task
    headers = {"Authorization": f"Bearer {USER_A_TOKEN}"}
    payload = {"title": "Hacked by User A"}
    response = requests.patch(f"{BASE_URL}/tasks/{TASK_ID_B}", json=payload, headers=headers)
    assert response.status_code == 403
    assert "permission" in response.text.lower()

def test_soft_delete_behavior():
    headers = {"Authorization": f"Bearer {USER_A_TOKEN}"}
    # 1. Delete task
    task_id = "some-task-id"
    requests.delete(f"{BASE_URL}/tasks/{task_id}", headers=headers)
    # 2. Verify it's not in the list
    response = requests.get(f"{BASE_URL}/tasks", headers=headers)
    tasks = response.json()
    assert not any(t['id'] == task_id for t in tasks)
```

### B. Frontend E2E Tests (Playwright)
*Focus: Critical User Journeys (CUJs) and UI State.*

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Task Lifecycle Workflow', () => {
  test('User can create and move task to completion', async ({ page }) => {
    // Auth
    await page.goto('/login');
    await page.fill('input[type="email"]', 'qa@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');

    // Create
    await page.click('text=+ New Task');
    await page.fill('input[aria-label="Title"]', 'Test QA Task');
    await page.click('text=Save Task');
    await expect(page.locator('text=Test QA Task')).toBeVisible();

    // Update Status
    await page.click('text=Edit'); // Simplified selector
    await page.selectOption('select', 'COMPLETED');
    await page.click('text=Save Task');
    
    // Verify Filter
    await page.click('text=Completed');
    await expect(page.locator('text=Test QA Task')).toBeVisible();
    await expect(page.locator('text=To Do')).not.toBeVisible();
  });

  test('Dashboard is protected from unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*login/);
  });
});
```

---

## 3. Edge Case Coverage Matrix

| Edge Case | Risk | Mitigation Strategy | Test Status |
| :--- | :--- | :--- | :--- |
| **Network Latency** | UI freezes or double-posts tasks. | Implement `loading` state on buttons (Already in `AuthForm`, needs adding to `TaskModal`). | ⚠️ Partial |
| **SQL Injection** | Unauthorized data access. | TypeORM Parameterized queries prevent this. | ✅ Covered |
| **XSS in Title** | Malicious script execution in dashboard. | React's default escaping prevents raw HTML injection. | ✅ Covered |
| **Token Expiry** | User session ends mid-edit. | Frontend should intercept `401 Unauthorized` and redirect to login. | ❌ Missing |
| **Concurrent Edits** | Data loss from "Last Save Wins". | MVP accepted behavior, but suggests adding `updatedAt` versioning for V2. | ✅ Accepted |

---

## 4. Defect Tracking Template

When a bug is found during the execution of the above suite, use the following format:

| Field | Description | Example |
| :--- | :--- | :--- |
| **Bug ID** | Unique identifier | `BUG-STMS-001` |
| **Severity** | Blocker / Critical / Major / Minor | `Critical` |
| **Priority** | P0 (Immediate) $\rightarrow$ P3 (Low) | `P0` |
| **Summary** | Clear, concise title | `API allows title > 255 chars via Postman` |
| **Environment** | Browser/OS/Build version | `Chrome 120 / Windows 11 / Build v1.0.2` |
| **Steps to Repro** | 1, 2, 3... | `1. Open Postman... 2. Send POST...` |
| **Expected** | What should have happened | `Should return 400 Bad Request` |
| **Actual** | What actually happened | `Returns 201 Created and crashes DB on render` |
| **Logs/Screenshots**| Attachments | `[error_log.txt] [screenshot.png]` |