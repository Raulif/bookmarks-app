import { SpeechManager } from "./SpeechManager";
export const speakText = (text: string) => {
  const speechManager = new SpeechManager();
  speechManager.speak(text);
};
