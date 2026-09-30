import pytest
import requests
import uuid

BASE_URL = "http://localhost:3000/api"
AUTH_TOKEN = "mock-jwt-token" # In real scenario, obtain via /auth/login

HEADERS = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}

def test_create_task_success():
    payload = {
        "title": "API Test Task",
        "description": "Testing CRUD via Pytest",
        "deadline": "2025-12-31",
        "category": "Work"
    }
    response = requests.post(f"{BASE_URL}/tasks", json=payload, headers=HEADERS)
    assert response.status_code == 201
    assert "id" in response.json()
    assert response.elapsed.total_seconds() < 0.2  # NFR: < 200ms

def test_create_task_past_date_fails():
    payload = {
        "title": "Past Task",
        "deadline": "2000-01-01",
        "category": "Work"
    }
    response = requests.post(f"{BASE_URL}/tasks", json=payload, headers=HEADERS)
    assert response.status_code == 400
    assert "VAL_001" in response.text # Expected Error Code

def test_data_isolation_security():
    # 1. Create task as User A
    payload = {"title": "User A Task", "deadline": "2025-12-31"}
    res_a = requests.post(f"{BASE_URL}/tasks", json=payload, headers=HEADERS)
    task_id = res_a.json()['id']

    # 2. Attempt to access/delete task as User B (different token)
    headers_b = {"Authorization": "Bearer different-user-token"}
    response = requests.delete(f"{BASE_URL}/tasks/{task_id}", headers=headers_b)
    
    # Should return 403 Forbidden or 404 Not Found to prevent leaking existence
    assert response.status_code in [403, 404]

def test_get_tasks_performance():
    # Ensure indices are working for large datasets (Mocked here)
    response = requests.get(f"{BASE_URL}/tasks", headers=HEADERS)
    assert response.status_code == 200
    assert response.elapsed.total_seconds() < 0.2
