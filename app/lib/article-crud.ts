export const getArticle = async (url: string, signal: AbortSignal) => {
  try {
    const urlParams = new URLSearchParams({ url });
    const response = await fetch(`/api/gemini?${urlParams.toString()}`, {
      signal,
    });
    const text = await response.json();
    console.log({text})
    if (typeof text === "string") {
      return text;
    } else {
      throw new Error("Invalid response format", text);
    }
  } catch (error) {
    console.error("Error fetching or speaking text:", error);
    return "";
  }
};
