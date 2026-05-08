import httpx


async def web_search(query: str):
    url = "https://api.duckduckgo.com/"
    params = {
        "q": query,
        "format": "json",
        "no_html": 1,
        "skip_disambig": 1,
    }

    try:
        print(f"[Search] Query: {query}")
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url, params=params)
            data = resp.json()

        # Try Abstract first, then RelatedTopics
        result = data.get("AbstractText", "")
        if not result:
            topics = data.get("RelatedTopics", [])
            if topics and isinstance(topics[0], dict):
                result = topics[0].get("Text", "No results found.")

        if not result:
            result = "No results found."

        print(f"[Search] Result: {result[:100]}")
        return {"query": query, "result": result}

    except Exception as e:
        print(f"[Search] Error: {type(e).__name__}: {e}")
        return {"query": query, "result": f"Search failed: {str(e)}"}
