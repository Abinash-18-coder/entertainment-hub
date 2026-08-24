import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://test"
    ) as ac:
        yield ac


@pytest_asyncio.fixture
async def auth_headers(client):
    """Fixture providing valid Authorization headers for a registered test user."""
    test_email = "qa_tester@cineverse.com"
    test_password = "SecurePassword123!"

    # Ensure user is registered
    await client.post(
        "/api/v1/auth/register",
        json={"email": test_email, "password": test_password}
    )

    # Login and extract token
    res = await client.post(
        "/api/v1/auth/login",
        json={"email": test_email, "password": test_password}
    )

    token = res.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}