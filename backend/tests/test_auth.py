"""Tests for authentication endpoints."""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User
from app.auth.jwt import hash_password, verify_password, create_access_token, verify_access_token


class TestJWTUtils:
    """Tests for JWT utility functions."""

    def test_hash_password(self):
        hashed = hash_password("mypassword")
        assert hashed != "mypassword"
        assert verify_password("mypassword", hashed)

    def test_verify_password_wrong(self):
        hashed = hash_password("mypassword")
        assert not verify_password("wrongpassword", hashed)

    def test_create_and_verify_access_token(self):
        token = create_access_token(data={"sub": "1"})
        payload = verify_access_token(token)
        assert payload is not None
        assert payload["sub"] == "1"
        assert payload["type"] == "access"

    def test_verify_invalid_token(self):
        payload = verify_access_token("invalid.token.here")
        assert payload is None


class TestRegister:
    """Tests for POST /api/v1/auth/register."""

    def test_register_success(self, client: TestClient):
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "new@example.com",
                "password": "password123",
                "full_name": "New User",
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "new@example.com"
        assert data["full_name"] == "New User"

    def test_register_duplicate_email(self, client: TestClient, test_user: User):
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "test@example.com",
                "password": "password123",
                "full_name": "Another User",
            },
        )
        assert response.status_code == 409

    def test_register_short_password(self, client: TestClient):
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "new@example.com",
                "password": "short",
                "full_name": "New User",
            },
        )
        assert response.status_code == 422

    def test_register_invalid_email(self, client: TestClient):
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": "not-an-email",
                "password": "password123",
                "full_name": "New User",
            },
        )
        assert response.status_code == 422


class TestLogin:
    """Tests for POST /api/v1/auth/login."""

    def test_login_success(self, client: TestClient, test_user: User):
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "test@example.com", "password": "password123"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client: TestClient, test_user: User):
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "test@example.com", "password": "wrongpass"},
        )
        assert response.status_code == 401

    def test_login_nonexistent_user(self, client: TestClient):
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "noone@example.com", "password": "password123"},
        )
        assert response.status_code == 401

    def test_login_inactive_user(self, client: TestClient, db: Session):
        user = User(
            email="inactive@example.com",
            hashed_password=hash_password("password123"),
            full_name="Inactive",
            is_active=False,
        )
        db.add(user)
        db.commit()

        response = client.post(
            "/api/v1/auth/login",
            json={"email": "inactive@example.com", "password": "password123"},
        )
        assert response.status_code == 401


class TestGetMe:
    """Tests for GET /api/v1/auth/me."""

    def test_get_me_authenticated(
        self, client: TestClient, test_user: User, auth_headers: dict
    ):
        response = client.get("/api/v1/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["full_name"] == "Test User"

    def test_get_me_unauthenticated(self, client: TestClient):
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401

    def test_get_me_invalid_token(self, client: TestClient):
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": "Bearer invalid_token"},
        )
        assert response.status_code == 401


class TestUpdateMe:
    """Tests for PUT /api/v1/auth/me."""

    def test_update_profile(
        self, client: TestClient, test_user: User, auth_headers: dict
    ):
        response = client.put(
            "/api/v1/auth/me",
            json={"full_name": "Updated Name"},
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert response.json()["full_name"] == "Updated Name"


class TestHealth:
    """Tests for GET /health."""

    def test_health_check(self, client: TestClient):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}
