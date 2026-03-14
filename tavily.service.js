import { tavily } from "@tavily/core";
import "dotenv/config"
const tavly = tavily({
    apiKey: process.env.TAVILY_API_KEY,
})


export async function searchInternet({ query }) {
    const results = await tavly.search(query);
   
    // Extract only content text from results
    const contentText = results.results
        .map(result => result.content)
        .filter(content => content)
        .join('\n\n');
    return contentText;
}



