import { tavily } from "@tavily/core";

// Initialize tavily with API key
const client = new tavily({
  apiKey: process.env.TAVILY_API_KEY
});

export async function searchInternet(query) {
  const response = await client.search(query, {
    max_results: 5
  });

  return JSON.stringify(response.results);
}