import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { GoogleGenAI } from "@google/genai";
import { setResponseStatus } from "@tanstack/react-start/server";
import { LLMPrompt } from "../../lib/llm-prompt";

const GEMINI_MODEL = "gemini-2.0-flash";
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const APIRoute = createAPIFileRoute("/api/gemini")({
  GET: async ({ request, params }) => {
    try {
      // Extract the URL from the request
      const reqUrl = new URL(request.url);
      const reqParams = reqUrl.searchParams;
      const targetUrl = reqParams.get("url") as string;
      const url = new URL(targetUrl);
      // Fetch the HTML content from the URL
      const fetchRes = await fetch(url);
      const html = await fetchRes.text();
      // Prepare the content for the AI model
      const contents = [
        {
          text: LLMPrompt,
        },
        {
          inlineData: {
            mimeType: "text/html",
            data: Buffer.from(html).toString("base64"),
          },
        },
      ];
      // Generate content using the AI model
      const aiResponse = await gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents,
      });

      const text = aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("No text found in the AI response");
      }

      setResponseStatus(200);
      return json(text);
    } catch (error) {
      console.error(error);
      setResponseStatus(500);
      return json({ error: error.message });
    }
  },
});
