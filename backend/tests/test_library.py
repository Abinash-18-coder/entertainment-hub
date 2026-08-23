import pytest
import uuid

TEST_USER_EMAIL = f"library_tester_{uuid.uuid4().hex}@cineverse.com"
TEST_USER_PASSWORD = "Password123456"

@pytest.mark.asyncio
async def test_library_bookmark_and_watched_flow(client):
    """Test full library lifecycle: Bookmark -> Check Status -> List -> Watched -> Unbookmark."""
    
    # 1. Register or Login
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

    # 2. Get first available content item ID
    contents_res = await client.get("/api/v1/contents/?page_size=1")
    items = contents_res.json()["items"]
    if len(items) == 0:
        pytest.skip("No content available to test library functionality")
    content_id = items[0]["id"]

    # 3. Toggle Bookmark (Add)
    bm_res = await client.post(f"/api/v1/library/bookmarks/{content_id}", headers=headers)
    assert bm_res.status_code == 200
    assert bm_res.json()["is_bookmarked"] is True

    # 4. Check Status
    status_res = await client.get(f"/api/v1/library/status/{content_id}", headers=headers)
    assert status_res.status_code == 200
    assert status_res.json()["is_bookmarked"] is True
    assert status_res.json()["is_watched"] is False

    # 5. List Bookmarks
    list_bm = await client.get("/api/v1/library/bookmarks", headers=headers)
    assert list_bm.status_code == 200
    assert any(c["id"] == content_id for c in list_bm.json()["items"])

    # 6. Toggle Watched (Add)
    w_res = await client.post(f"/api/v1/library/watched/{content_id}", headers=headers)
    assert w_res.status_code == 200
    assert w_res.json()["is_watched"] is True

    # 7. Toggle Bookmark again (Remove)
    unbm_res = await client.post(f"/api/v1/library/bookmarks/{content_id}", headers=headers)
    assert unbm_res.status_code == 200
    assert unbm_res.json()["is_bookmarked"] is False