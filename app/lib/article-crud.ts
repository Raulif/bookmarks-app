export const getArticle = async (url: string, signal: AbortSignal) => {
  try {
    const urlParams = new URLSearchParams({ url });
    const response = await fetch(`/api/article?${urlParams.toString()}`, {
      signal,
    });
    const text = await response.json();
    if (typeof text === "string") {
      return text;
    } else {
      throw new Error("Invalid response format", text);
    }
  } catch (error) {
    console.error("Error in getArticle [client]:", error);
    return "";
  }
};
