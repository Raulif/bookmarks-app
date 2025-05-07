import { speakText } from "./speakText";
export const hearArticle = async (url: string) => {
  try {
    // const urlParams = new URLSearchParams({url})
    // const response = await fetch(`/api/gemini?${urlParams.toString()}`);
    // const text = await response.json();
    const text = "";
    if (typeof text === "string") {
      await speakText(text);
    } else {
      throw new Error("Invalid response format", text);
    }
  } catch (error) {
    console.error("Error fetching or speaking text:", error);
    throw new Error("", error);
  }
};
