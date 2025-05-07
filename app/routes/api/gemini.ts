import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { GoogleGenAI } from "@google/genai";
import { setResponseStatus } from "@tanstack/react-start/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = "gemini-2.0-flash-lite";

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
          text: "This is a HTML page with an article or a blog entry in it. Please extract the main text content from it and return it as plain text. Do not include any HTML tags or other elements. Just the main text content. Please include the title of the article at the beginning, prefixed by the text 'Title:'. Please replace every dot in the text which is relevant to understand the text, so that the speech synthesiser can read the text appropriately. Examples of this would be the dots in a URL, or on file names. like in 'utility.js', or in technology terms like 'Next.js' or 'React.memo'. Please do not do that if the dot has a grammar meaning, like a full stop at the end of a sentencen. If you find the page not to be an article or a blog entry, (for example it could be a landing page of a company or a technology, or it could also be a Github Repo), then please let me know, and please give me a brief explanation of why you came to that conclusion.",
        },
        {
          inlineData: {
            mimeType: "text/html",
            data: Buffer.from(html).toString("base64"),
          },
        },
      ];
      // Generate content using the AI model
      const aiResponse = await ai.models.generateContent({
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
