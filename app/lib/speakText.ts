export const speakText = (t: string) => {
  try {
    const text =
      "Title: A Quick Journey Into the Linux Kernel\nI recently revisited my old operating systems coursework and realized how much of it felt too abstract: I'd learned about processes, scheduling, and memory management, but mostly in a theoretical sense. That's when I decided to pick up Robert Love's *Linux Kernel Development* book. Despite being written for the (now quite old) 2.6 kernel series, its pages still offer good insights into the fundamental ideas behind Linux internals. Reading it reminded me that while specific APIs and data structures evolve over time, the core design principles remain quite consistent.\n\nI wanted a concrete understanding of how \"real world\" operating systems solve everyday problems - things like scheduling processes fairly, dispatching interrupts promptly, and managing memory without wasting CPU cycles. Love's book was a great starting point, and it prompted me to dig even deeper into current kernel sources and documentation to see what had changed (and, quite often, what had stayed the same). In this blog post, I'll walk you through some of the biggest takeaways from my kernel deep dive, with some personal commentary alongside the factual details.\n\nGetting Started in Kernel Land\n";
    // const text = "Title: A Quick Journey Into the Lunux Kernel";
    // Create speech synthesiser
    const synth = window.speechSynthesis;
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);

    // Wait for synthesiser to have loaded the voices,
    // otherwise we will get the standard voice.
    utterance.onerror = (error) => {
      console.error("Utterance error: ", error);
      synth.cancel()
    };
    synth.onvoiceschanged = () => {
      const voices = synth.getVoices();
      const selectedVoice = voices.find(
        (voice) => voice.name === "Google US English"
      ) as SpeechSynthesisVoice;
      utterance.voice = selectedVoice;
      console.log({ utterance });
      // Start speech
      synth.speak(utterance);
      setTimeout(() => {
        console.log(synth);
      }, 5000);
    };
  } catch (error) {
    console.error(error);
  }
};
