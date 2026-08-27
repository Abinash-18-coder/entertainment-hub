import asyncio
import httpx


async def main():
    transport = httpx.AsyncHTTPTransport(
        local_address="0.0.0.0"
    )

    async with httpx.AsyncClient(
        transport=transport,
        timeout=15.0
    ) as client:
        response = await client.get(
            "https://api.themoviedb.org"
        )

        print("STATUS:", response.status_code)
        print("URL:", response.url)


asyncio.run(main())