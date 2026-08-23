import pytest

TEST_USER_EMAIL = "recommender_tester@cineverse.com"
TEST_USER_PASSWORD = "Password123!"

@pytest.mark.asyncio
async def test_recommendations_endpoint(client):
    """Verify that personalized recommendations return valid items without errors."""
    
    # 1. Register & Login
    await client.post(
        "/api/v1/auth/register",
        json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
    )
    login_res = await client.post(
        "/api/v1/auth/login",
        json={"email": TEST_USER_EMAIL, "password": TEST_USER_PASSWORD}
    )
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Fetch recommendations (will test cold-start fallback if empty, or rule-based if bookmarks exist)
    rec_res = await client.get("/api/v1/library/recommendations", headers=headers)
    assert rec_res.status_code == 200
    data = rec_res.json()
    assert "items" in data
    assert "total_count" in data
    assert isinstance(data["items"], list)