import pytest
import requests

BASE_URL = "http://localhost:3000/api/auth"

def test_registration_validation_matrix():
    """Tests the input validation matrix requirements from BRD Section 4.1"""
    payloads = [
        {"email": "invalid-email", "password": "Pass1!", "confirmPassword": "Pass1!", "tos": True, "expected": 400, "msg": "Please enter a valid email address."},
        {"email": "test@test.com", "password": "short", "confirmPassword": "short", "tos": True, "expected": 400, "msg": "Password does not meet security requirements."},
        {"email": "test@test.com", "password": "StrongPass1!", "confirmPassword": "Mismatch1!", "tos": True, "expected": 400, "msg": "Passwords do not match."},
        {"email": "test@test.com", "password": "StrongPass1!", "confirmPassword": "StrongPass1!", "tos": False, "expected": 400, "msg": "Agreement to Terms is required."},
    ]

    for p in payloads:
        response = requests.post(f"{BASE_URL}/register", json=p)
        assert response.status_code == p["expected"]
        assert p["msg"] in response.text

def test_sql_injection_attempt():
    """Tests for SQL injection vulnerability in registration endpoint"""
    injection_payload = {
        "email": "' OR 1=1 --",
        "password": "Password123!",
        "confirmPassword": "Password123!",
        "tos": True
    }
    response = requests.post(f"{BASE_URL}/register", json=injection_payload)
    # Should be rejected by Zod validation or handled safely by ORM
    assert response.status_code in [400, 422]

def test_api_performance_constraint():
    """Tests that /auth endpoints respond within < 2 seconds as per BRD 4.2"""
    import time
    start = time.time()
    requests.post(f"{BASE_URL}/login", json={"email": "test@test.com", "password": "Password123!"})
    duration = time.time() - start
    assert duration < 2.0

def test_malformed_json():
    """Tests that malformed JSON returns 400 Bad Request"""
    headers = {'Content-Type': 'application/json'}
    response = requests.post(f"{BASE_URL}/register", data="{'invalid': json}", headers=headers)
    assert response.status_code == 400
