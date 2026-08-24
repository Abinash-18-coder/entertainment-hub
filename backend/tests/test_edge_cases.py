import pytest

@pytest.mark.asyncio
async def test_unauthenticated_personal_routes_fail_cleanly(client):
    """Verify that unauthenticated access to personal library routes returns 401."""
    # 1. Unauthenticated bookmarks access
    res_bm = await client.get("/api/v1/library/bookmarks")
    assert res_bm.status_code == 401
    assert res_bm.json()["detail"] == "Not authenticated" or "credentials" in res_bm.json()["detail"].lower()

    # 2. Unauthenticated watched access
    res_w = await client.get("/api/v1/library/watched")
    assert res_w.status_code == 401

    # 3. Unauthenticated recommendations access
    res_rec = await client.get("/api/v1/library/recommendations")
    assert res_rec.status_code == 401

    # 4. Unauthenticated toggle mutation
    res_toggle = await client.post("/api/v1/library/bookmarks/1")
    assert res_toggle.status_code == 401

@pytest.mark.asyncio
async def test_pagination_boundary_limits(client):
    """Verify pagination with boundary limits (e.g., page 1 with page_size=100 and page=99999)."""
    # Max page_size boundary
    res_max = await client.get("/api/v1/contents/?page=1&page_size=100")
    assert res_max.status_code == 200
    assert len(res_max.json()["items"]) <= 100

    # Over-limit page_size rejected by Pydantic validation (max is 100)
    res_invalid_size = await client.get("/api/v1/contents/?page=1&page_size=500")
    assert res_invalid_size.status_code == 422

    # High out-of-range page returns empty items array safely
    res_empty_page = await client.get("/api/v1/contents/?page=99999&page_size=20")
    assert res_empty_page.status_code == 200
    assert res_empty_page.json()["items"] == []
    assert res_empty_page.json()["page"] == 99999

@pytest.mark.asyncio
async def test_special_characters_in_search(client):
    """Verify that search query handles special characters and URL encodings safely."""
    # Search with SQL injection patterns and symbols
    special_queries = ["'", "'' OR 1=1 --", "<script>", "@#$%^&*", "   "]
    
    for q in special_queries:
        res = await client.get(f"/api/v1/contents/search?q={q}")
        assert res.status_code in [200, 422]
        if res.status_code == 200:
            assert "items" in res.json()
            assert isinstance(res.json()["items"], list)

@pytest.mark.asyncio
async def test_toggle_non_existent_content_returns_404(client, auth_headers):
    """Verify bookmarking or watching non-existent content IDs returns 404."""
    invalid_id = 99999999
    
    bm_res = await client.post(f"/api/v1/library/bookmarks/{invalid_id}", headers=auth_headers)
    assert bm_res.status_code == 404
    assert bm_res.json()["detail"] == "Content not found"

    w_res = await client.post(f"/api/v1/library/watched/{invalid_id}", headers=auth_headers)
    assert w_res.status_code == 404
    assert w_res.json()["detail"] == "Content not found"