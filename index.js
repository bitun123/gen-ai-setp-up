import "dotenv/config"
import readline from "readline/promises";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, tool, createAgent } from "langchain";
import { sendEmail } from "./mail.service.js";
import { searchInternet } from "./tavily.service.js";
import * as z from "zod";



const emailTool = tool(
    sendEmail,
    {
        name:"emailTool",
        description:"A tool to send emails.",
        schema:z.object({
            to: z.string().describe("The recipient's email address"),
            html:z.string().describe("The HTML content of the email"),
            subject: z.string().describe("The subject of the email"),
        })
    }
)

const tavilyTool = tool(
    searchInternet,
    {
        name: "tavilySearch",
        description: "A tool to search the internet for real-time information using Tavily. Use this to find current news, data, and information.",
        schema: z.object({
            query: z.string().describe("The search query to find information about"),
        })
    }
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
});

const agent  = createAgent({
    model,
    tools:[emailTool,tavilyTool]
})

const messages = [];

while (true) {
    const userInput = await rl.question("\x1b[32mYou:\x1b[0m ")

    messages.push(new HumanMessage(userInput))

  const response = await agent.invoke({ messages });
    messages.push(response.messages[ response.messages.length - 1 ])

    console.log(`\x1b[34m[AI]\x1b[0m ${response.messages[ response.messages.length - 1 ].content}`)
}
