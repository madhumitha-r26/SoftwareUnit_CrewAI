# UI/UX Design Specification: User Authentication Module
**Version:** 1.0  
**Designer:** UI/UX Lead  
**Objective:** Create a secure, friction-less, and accessible entry point for the application that balances strict security requirements (anti-enumeration) with high user satisfaction.

---

## 1. User Journey Maps

### 1.1 Registration Journey (The "Onboarding" Path)
**Persona:** Guest User $\rightarrow$ Goal: Create a secure account.

| Stage | Action | User Emotion | System Response | Touchpoint |
| :--- | :--- | :--- | :--- | :--- |
| **Entry** | Navigates to Registration page | $\text{Neutral}$ | Displays clean registration form | Landing/Login Page |
| **Input** | Enters Email and Password | $\text{Focused}$ | Real-time validation of password strength | Input Fields |
| **Consent** | Checks Terms of Service | $\text{Cautious}$ | Visual confirmation of checkbox state | TOS Checkbox |
| **Submission** | Clicks "Sign Up" | $\text{Anticipating}$ | Loading state $\rightarrow$ Backend validation | CTA Button |
| **Completion** | Redirected to Login | $\text{Satisfied}$ | Success Toast: "Account created successfully" | Login Page |

### 1.2 Login Journey (The "Access" Path)
**Persona:** Registered User $\rightarrow$ Goal: Access private dashboard.

| Stage | Action | User Emotion | System Response | Touchpoint |
| :--- | :--- | :--- | :--- | :--- |
| **Entry** | Navigates to Login page | $\text{Purposeful}$ | Displays Email/Password fields | Login Page |
| **Auth** | Enters credentials & submits | $\text{Expecting}$ | Backend Argon2 verification | Login Form |
| **Success** | Redirected to Dashboard | $\text{Relieved}$ | JWT storage $\rightarrow$ UI Hydration | Dashboard |
| **Failure** | Enters wrong password | $\text{Frustrated}$ | Generic Error: "Invalid email or password" | Error Banner |

---

## 2. Low-Fidelity Wireframe Layouts

### 2.1 Registration Page
*Layout focus: Minimal distractions, clear hierarchy, and guidance on password complexity.*

```markdown
+-----------------------------------------------------------+
| [ Logo ]                                                  |
+-----------------------------------------------------------+
|                                                           |
|                    CREATE ACCOUNT                         |
|            (Subtitle: Join us to get started)              |
|                                                           |
|   Email Address                                           |
|   +---------------------------------------------------+   |
|   | user@email.com                                    |   |
|   +---------------------------------------------------+   |
|   [ ! Please enter a valid email address. (Hidden) ]       |
|                                                           |
|   Password                                                |
|   +---------------------------------------------------+   |
|   | ••••••••••••••••                                  |   |
|   +---------------------------------------------------+   |
|   (Password Requirements: 8+ chars, 1 Upper, 1 Num, 1 Spec)|
|                                                           |
|   Confirm Password                                        |
|   +---------------------------------------------------+   |
|   | ••••••••••••••••                                  |   |
|   +---------------------------------------------------+   |
|                                                           |
|   [x] I agree to the Terms of Service                     |
|   [ ! Agreement to Terms is required. (Hidden) ]           |
|                                                           |
|   +---------------------------------------------------+   |
|   |                   SIGN UP                        |   |
|   +---------------------------------------------------+   |
|                                                           |
|   Already have an account? [Login here]                   |
+-----------------------------------------------------------+
```

### 2.2 Login Page
*Layout focus: High contrast, speed of entry, and security-first error handling.*

```markdown
+-----------------------------------------------------------+
| [ Logo ]                                                  |
+-----------------------------------------------------------+
|                                                           |
|                       WELCOME BACK                        |
|                                                           |
|   +---------------------------------------------------+    |
|   | ERROR: Invalid email or password.                |    |
|   +---------------------------------------------------+    |
|                                                           |
|   Email Address                                           |
|   +---------------------------------------------------+   |
|   | user@email.com                                    |   |
|   +---------------------------------------------------+   |
|                                                           |
|   Password                                                |
|   +---------------------------------------------------+   |
|   | ••••••••••••••••                     [ Show ]     |   |
|   +---------------------------------------------------+   |
|                                                           |
|   +---------------------------------------------------+   |
|   |                     LOGIN                        |   |
|   +---------------------------------------------------+   |
|                                                           |
|   New here? [Create an account]                          |
+-----------------------------------------------------------+
```

---

## 3. Design System Tokens

### 3.1 Color Palette
| Token | Value | Usage | Psychology/Purpose |
| :--- | :--- | :--- | :--- |
| `color-primary` | `#2563EB` | CTAs, Links | Trust, Professionalism |
| `color-success` | `#16A34A` | Success Toasts | Completion, Safety |
| `color-error` | `#DC2626` | Validation Errors | Urgency, Warning |
| `color-bg-main` | `#F9FAFB` | Page Background | Low eye-strain |
| `color-text-main`| `#111827` | Primary Headers | High readability |
| `color-text-muted`| `#6B7280` | Subtitles/Helper text | Visual hierarchy |
| `color-border` | `#D1D5DB` | Input borders | Structure |

### 3.2 Typography
*   **Primary Font:** Inter or Roboto (Sans-serif for maximum legibility)
*   **H1 (Page Title):** 24px | Bold | `color-text-main` | Tracking: -0.02em
*   **Label (Input):** 14px | Medium | `color-text-main` | Margin-bottom: 4px
*   **Helper Text:** 12px | Regular | `color-text-muted` | Line-height: 1.4
*   **Error Text:** 12px | Regular | `color-error` | Weight: Medium

### 3.3 Spacing & Grid
*   **Base Unit:** 4px
*   **Container Padding:** 24px (Mobile) / 48px (Desktop)
*   **Input Gap:** 16px (Vertical spacing between fields)
*   **Border Radius:** 8px (Soft corners for modern, approachable feel)

---

## 4. Accessibility (WCAG 2.1) Guidelines

To ensure inclusivity and compliance, the following constraints are mandated:

1.  **Contrast Ratio:** All text must maintain a minimum contrast ratio of **4.5:1** against its background (AA Standard).
2.  **Keyboard Navigation:**
    *   Full `Tab` index support for all inputs and buttons.
    *   Visible `:focus` ring using `color-primary` with 2px offset.
3.  **Screen Reader Support (ARIA):**
    *   `aria-invalid="true"` applied to inputs during validation errors.
    *   `aria-describedby` linking inputs to their respective error messages.
    *   `role="alert"` for the generic login error banner.
4.  **Error Identification:** Errors must not be indicated by color alone (e.g., a red border must be accompanied by an error icon and text).

---

## 5. Interaction Flow Diagrams

### 5.1 Registration Logic Flow
`Start` $\rightarrow$ `Input Data` $\rightarrow$ `Client-side Regex Check` $\rightarrow$ `TOS Verified?`
*   **NO** $\rightarrow$ `Trigger Error: "Agreement Required"` $\rightarrow$ `Focus TOS Checkbox`
*   **YES** $\rightarrow$ `POST /auth/register` $\rightarrow$ `API Response`
    *   **409 Conflict** $\rightarrow$ `Display: "Email in use"`
    *   **201 Created** $\rightarrow$ `Show Success Toast` $\rightarrow$ `Redirect /login`

### 5.2 Login Security Flow
`Start` $\rightarrow$ `Input Email/Pass` $\rightarrow$ `POST /auth/login` $\rightarrow$ `Backend Argon2 Match`
*   **FAIL (Wrong Pass OR User not found)** $\rightarrow$ `Return 401` $\rightarrow$ `Display Generic Error: "Invalid email or password"` $\rightarrow$ `Clear Password Field`
*   **SUCCESS** $\rightarrow$ `Return 200 + JWT` $\rightarrow$ `Set HttpOnly Cookie` $\rightarrow$ `Redirect /dashboard`

### 5.3 Session Expiry Flow
`User Action` $\rightarrow$ `API Request` $\rightarrow$ `Access Token Expired (401)` $\rightarrow$ `Silent Refresh Call`
*   **Refresh Token Valid** $\rightarrow$ `Update Access Token` $\rightarrow$ `Retry Original Request`
*   **Refresh Token Expired (403)** $\rightarrow$ `Wipe Local State` $\rightarrow$ `Redirect /login` $\rightarrow$ `Toast: "Session expired. Please login again."`