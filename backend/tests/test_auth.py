import pytest

TEST_EMAIL = "auth_tester@cineverse.com"
TEST_PASSWORD = "SuperSecretPassword123"

@pytest.mark.asyncio
async def test_register_and_login_flow(client):
    """Test full cycle: Registration -> Login -> Access Protected Route -> Refresh Token."""
    
    # 1. Register User
    reg_response = await client.post(
        "/api/v1/auth/register",
        json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    # If user already exists in DB from previous run, accept 201 or 400
    assert reg_response.status_code in [201, 400]

    # 2. Login with correct password
    login_response = await client.post(
        "/api/v1/auth/login",
        json={"email": TEST_EMAIL, "password": TEST_PASSWORD}
    )
    assert login_response.status_code == 200
    tokens = login_response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens
    assert tokens["token_type"] == "bearer"

    access_token = tokens["access_token"]
    refresh_token = tokens["refresh_token"]

    # 3. Access Protected Route (/me) with valid token
    headers = {"Authorization": f"Bearer {access_token}"}
    me_response = await client.get("/api/v1/auth/me", headers=headers)
    assert me_response.status_code == 200
    user_data = me_response.json()
    assert user_data["email"] == TEST_EMAIL

    # 4. Access Protected Route without token should fail (401)
    unauth_response = await client.get("/api/v1/auth/me")
    assert unauth_response.status_code == 401

    # 5. Refresh token exchange
    refresh_response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token}
    )
    assert refresh_response.status_code == 200
    new_tokens = refresh_response.json()
    assert "access_token" in new_tokens

@pytest.mark.asyncio
async def test_login_invalid_password(client):
    """Verify that an incorrect password fails with HTTP 401."""
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": TEST_EMAIL, "password": "WrongPassword123"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password."