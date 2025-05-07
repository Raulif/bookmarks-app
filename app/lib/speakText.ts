import { SpeechManager } from "./SpeechManager";
export const speakText = (text: string) => {
  const speechManager = new SpeechManager();
  // try {
  speechManager.speak(text);
  //   // const text =
  //   //   "Title: A Quick Journey Into the Linux Kernel\nI recently revisited my old operating systems coursework and realized how much of it felt too abstract: I'd learned about processes, scheduling, and memory management, but mostly in a theoretical sense. That's when I decided to pick up Robert Love's *Linux Kernel Development* book. Despite being written for the (now quite old) 2.6 kernel series, its pages still offer good insights into the fundamental ideas behind Linux internals. Reading it reminded me that while specific APIs and data structures evolve over time, the core design principles remain quite consistent.\n\nI wanted a concrete understanding of how \"real world\" operating systems solve everyday problems - things like scheduling processes fairly, dispatching interrupts promptly, and managing memory without wasting CPU cycles. Love's book was a great starting point, and it prompted me to dig even deeper into current kernel sources and documentation to see what had changed (and, quite often, what had stayed the same). In this blog post, I'll walk you through some of the biggest takeaways from my kernel deep dive, with some personal commentary alongside the factual details.\n\nGetting Started in Kernel Land\n";
  //   // const text = "Title: A Quick Journey Into the Lunux Kernel";
  //   // Create speech synthesiser

  //   const synth = window.speechSynthesis;
  //   // Create speech utterance

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = "en-US";
  //   // Wait for synthesiser to have loaded the voices,
  //   // otherwise we will get the standard voice.
  //   utterance.onerror = (error) => {
  //     // utterance = null;
  //     // synth = null;
  //     console.error("Utterance error: ", error);
  //   };
  //   // synth.onvoiceschanged = () => {
  //   // const voices = synth.getVoices();
  //   // const selectedVoice = voices.find(
  //   //   (voice) => voice.name === "Google US English"
  //   // ) as SpeechSynthesisVoice;
  //   // utterance.voice = selectedVoice;
  //   console.log({ utterance });
  //   // Start speech
  //   synth.cancel();
  //   synth.speak(utterance);
  //   let fixForLongTextsInterval = setInterval(() => {
  //     console.log({ synth });
  //     if (!synth.speaking) {
  //       clearInterval(fixForLongTextsInterval);
  //     } else {
  //       synth.pause();
  //       synth.resume();
  //     }
  //   }, 14000);
  //   // };
  // } catch (error) {
  //   console.error(error);
  // }
};
