# QA TEST SUITE & EXECUTION MATRIX: User Authentication Module

## 1. Test Execution Matrix

| ID | Requirement | Test Case Name | Priority | Method | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC-01 | US.1 | Successful Reg | High | Auto | Account created, redirect to /login | ⏳ |
| TC-02 | US.1 | Duplicate Email | High | Auto | 400 Error: "Email is already in use" | ⏳ |
| TC-03 | US.1 | GDPR Checkbox | High | Auto | Prevent submission, red highlight | ⏳ |
| TC-04 | US.2 | Successful Login | Critical | Auto | JWT issued, redirect to /dashboard | ⏳ |
| TC-05 | US.2 | Anti-Enumeration | Critical | Auto | Generic "Invalid email or password" | ⏳ |
| TC-06 | 4.1 | Email Regex | Medium | Auto | Block non-RFC 5322 emails | ⏳ |
| TC-07 | 4.1 | Password Strength | Medium | Auto | Block weak passwords (<8, no special) | ⏳ |
| TC-08 | 4.2 | Token Storage | Critical | Manual | Refresh token is HttpOnly, Secure | ⏳ |
| TC-09 | 5.0 | SQL Injection | Critical | Auto | 400 Bad Request / Sanitized | ⏳ |
| TC-10 | 5.0 | Brute Force | High | Manual | Lockout after 5 failed attempts | ⏳ |
| TC-11 | 5.0 | Session Refresh | High | Auto | 401 triggers silent refresh via Interceptor | ⏳ |

---

## 2. Manual Test Cases (Detailed)

### MT-01: Token Security Audit
*   **Step 1:** Log in to the application.
*   **Step 2:** Open DevTools $\rightarrow$ Application $\rightarrow$ Cookies.
*   **Step 3:** Verify `refreshToken` exists.
*   **Step 4:** Verify `HttpOnly` and `Secure` flags are checked.
*   **Step 5:** Open Console and try to access `document.cookie`.
*   **Expected:** `refreshToken` should NOT be visible in the console.

### MT-02: Brute Force Lockout
*   **Step 1:** Go to `/login`.
*   **Step 2:** Enter a valid email but incorrect password 5 times consecutively.
*   **Step 3:** Attempt a 6th login with the CORRECT password.
*   **Expected:** System should block access or trigger CAPTCHA, regardless of password correctness.

---

## 3. Edge Case Coverage

| Edge Case | Test Strategy | Validation Logic |
| :--- | :--- | :--- |
| **Network Timeout** | Throttling (Chrome DevTools) | Check for "Server is taking too long..." banner |
| **Rapid-Fire Clicks** | Automation (Playwright) | Ensure double-clicking "Sign Up" doesn't create duplicate users |
| **XSS in Email Field** | Payload: `<script>alert(1)</script>@test.com` | Verify script is escaped and not executed in DB/UI |
| **Token Expiry** | Manual Delay | Set Access Token to 10s $\rightarrow$ Verify interceptor calls `/refresh` |

---

## 4. Defect Tracking Template

| Defect ID | Severity | Priority | Description | Steps to Reproduce | Expected | Actual | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| BUG-001 | Block | High | [Example] | 1. ... 2. ... | ... | ... | Open |

---

## 5. QA Sign-off Criteria
- [ ] 100% of "Critical" and "High" test cases passed.
- [ ] Zero "Blocker" or "Critical" bugs remaining.
- [ ] Token storage verified as `HttpOnly` via manual audit.
- [ ] Password hashing verified as `Argon2` via DB schema review.
- [ ] All API endpoints responding under 2 seconds.
