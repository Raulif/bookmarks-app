import { useCallback, useRef } from "react";
import { useSpeachStore } from "../store/useSpeechStore";
import { getArticle } from "../lib/article-crud";
import { SpeechManager } from "../lib/SpeechManager";
import { useBookmarks } from "./useBookmarks";
export const useSpeechManager = () => {
  const { sortedBookmarks } = useBookmarks();
  const currentId = useRef("");
  const {
    setSpeechManager,
    speechManager,
    setSpeaking,
    setGettingText,
    abortController,
    setAbortController,
    setCurrentTrackId,
  } = useSpeachStore();

  const onCancelClick = useCallback(() => {
    abortController?.abort("cancel fetching");
    setGettingText(false);
    speechManager?.stop();
    setAbortController(new AbortController());
  }, [abortController, speechManager, setAbortController]);

  const createSpeechManager = () => {
    const speechManager = new SpeechManager({
      onPlay: () => setSpeaking(true),
      onStop: () => setSpeaking(false),
      onEnd: playNextItem,
    });
    setSpeechManager(speechManager);
    return speechManager;
  };

  const onHearClick = useCallback(
    async (id: string) => {
      const speechManager = createSpeechManager();

      setCurrentTrackId(id);
      currentId.current = id;

      const url = sortedBookmarks.find(
        (bookmark: any) => bookmark.id === id
      )?.url;

      if (!url) throw Error("No url found to play");

      setGettingText(true);

      try {
        const text = await getArticle(url, abortController.signal);
        setGettingText(false);
        await speechManager?.speak(text);
      } catch (error) {
        console.error("Error on hear click: ", error);
        setCurrentTrackId("");
        currentId.current = "";
        setGettingText(false);
      }
    },
    [
      sortedBookmarks,
      setCurrentTrackId,
      currentId.current,
      abortController,
    ]
  );

  const playNextItem = useCallback(() => {
    // Find next ID
    const currentIndex = sortedBookmarks.findIndex(
      (bm) => bm.id === currentId.current
    );
    const nextId = sortedBookmarks[currentIndex + 1].id;
    onHearClick(nextId);
  }, [onHearClick, currentId.current]);

  const onStopClick = useCallback(() => {
    speechManager?.stop();
  }, [speechManager]);

  return {
    onHearClick,
    onStopClick,
    onCancelClick,
  };
};
