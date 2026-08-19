import pytest

@pytest.mark.asyncio
async def test_health_check(client):
    """Verify that the health check endpoint returns 200 OK."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "success"

@pytest.mark.asyncio
async def test_get_genres_list(client):
    """Verify that the genres endpoint returns a valid list."""
    response = await client.get("/api/v1/genres/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "name" in data[0]
        assert "tmdb_id" in data[0]

@pytest.mark.asyncio
async def test_list_contents_pagination(client):
    """Verify content listing with pagination."""
    response = await client.get("/api/v1/contents/?page=1&page_size=5")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total_count" in data
    assert "page" in data
    assert data["page"] == 1
    assert len(data["items"]) <= 5

@pytest.mark.asyncio
async def test_filter_by_content_type(client):
    """Verify filtering contents by 'movie'."""
    response = await client.get("/api/v1/contents/?content_type=movie&page_size=10")
    assert response.status_code == 200
    data = response.json()
    for item in data["items"]:
        assert item["content_type"] == "movie"

@pytest.mark.asyncio
async def test_search_endpoint(client):
    """Verify search functionality."""
    response = await client.get("/api/v1/contents/search?q=a")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data

@pytest.mark.asyncio
async def test_non_existent_content_detail_returns_404(client):
    """Verify requesting a non-existent ID returns HTTP 404."""
    response = await client.get("/api/v1/contents/99999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Content not found"