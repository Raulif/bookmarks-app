// Speech Synthesis Manager for Large Text - TypeScript Version

// Types and interfaces
interface SpeechManagerOptions {
  chunkSize?: number;
  lang?: string;
}

interface ProgressInfo {
  currentChunk: number;
  totalChunks: number;
  percentage: number;
  currentText: string;
  isComplete: boolean;
}

interface SpeechStatus {
  isPlaying: boolean;
  isPaused: boolean;
  currentChunk: number;
  totalChunks: number;
  percentage: number;
}

type ProgressCallback = (progress: ProgressInfo) => void;

export class SpeechManager {
  options: Required<SpeechManagerOptions>;
  synth: SpeechSynthesis;
  private chunks: string[];
  private currentChunk: number;
  private isPaused: boolean;
  private isPlaying: boolean;
  private progressCallbacks: ProgressCallback[];
  private bugFixInterval: NodeJS.Timeout | null;

  constructor(options: SpeechManagerOptions = {}) {
    // Default options
    this.options = {
      chunkSize: options.chunkSize ?? 1500,
      lang: options.lang ?? "en-US",
    };

    this.synth = window.speechSynthesis;
    this.chunks = [];
    this.currentChunk = 0;
    this.isPaused = false;
    this.isPlaying = false;
    this.progressCallbacks = [];
    this.bugFixInterval = null;
  }

  // Split text into manageable chunks
  private _prepareChunks(text: string): number {
    const { chunkSize } = this.options;

    // Clear existing chunks
    this.chunks = [];
    this.currentChunk = 0;

    // Split by sentences to avoid cutting in the middle of a sentence
    const sentences = text.split(/(?<=[.!?])\s+/);
    let currentChunk = "";

    sentences.forEach((sentence) => {
      // If adding this sentence exceeds chunk size and we already have content,
      // push current chunk and start a new one
      if (
        currentChunk.length + sentence.length > chunkSize &&
        currentChunk.length > 0
      ) {
        this.chunks.push(currentChunk);
        currentChunk = "";
      }

      // If a single sentence exceeds chunk size, split it further
      if (sentence.length > chunkSize) {
        // If we have content in current chunk, push it first
        if (currentChunk.length > 0) {
          this.chunks.push(currentChunk);
          currentChunk = "";
        }

        // Split long sentence into chunks, trying to break at commas or spaces
        let remainingSentence = sentence;
        while (remainingSentence.length > chunkSize) {
          // Find a good breaking point
          let breakPoint = remainingSentence.lastIndexOf(",", chunkSize);
          if (breakPoint === -1 || breakPoint < chunkSize * 0.5) {
            breakPoint = remainingSentence.lastIndexOf(" ", chunkSize);
          }
          if (breakPoint === -1) breakPoint = chunkSize;

          this.chunks.push(remainingSentence.substring(0, breakPoint + 1));
          remainingSentence = remainingSentence.substring(breakPoint + 1);
        }

        currentChunk = remainingSentence;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    });

    // Don't forget the last chunk
    if (currentChunk.length > 0) {
      this.chunks.push(currentChunk);
    }

    return this.chunks.length;
  }

  // Create utterance with proper settings
  private _createUtterance(text: string): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = this.options.lang;

    // Handle chunk completion
    utterance.onend = () => this._handleChunkEnd();
    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
      console.error("SpeechSynthesis error:", e);
      if (e.error !== "interrupted") {
        this.stop();
        this._handleChunkEnd();
      }
    };

    return utterance;
  }

  private _handleChunkEnd(): void {
    // Notify about progress
    this._notifyProgress();

    // If not paused and not the last chunk, continue to the next
    if (!this.isPaused && this.currentChunk < this.chunks.length - 1) {
      this.currentChunk++;
      this._speakCurrentChunk();
    } else if (this.currentChunk >= this.chunks.length - 1) {
      // We've finished all chunks
      this.isPlaying = false;
      this._notifyProgress(true);
    }
  }

  private _speakCurrentChunk(): void {
    if (this.currentChunk < this.chunks.length) {
      const utterance = this._createUtterance(this.chunks[this.currentChunk]);
      this.synth.speak(utterance);
    }
  }

  private _notifyProgress(isComplete: boolean = false): void {
    const progress: ProgressInfo = {
      currentChunk: this.currentChunk + 1,
      totalChunks: this.chunks.length,
      percentage: this.chunks.length
        ? Math.round(((this.currentChunk + 1) / this.chunks.length) * 100)
        : 0,
      currentText: this.chunks[this.currentChunk] || "",
      isComplete,
    };

    this.progressCallbacks.forEach((callback) => callback(progress));
  }

  // Public methods

  // Start speaking the text
  public speak(text: string): boolean {
    // Stop any ongoing speech
    this.stop();

    // Prepare the text
    const chunkCount = this._prepareChunks(text);

    if (chunkCount > 0) {
      this.isPaused = false;
      this.isPlaying = true;
      this.currentChunk = 0;

      // Start speaking the first chunk
      this._speakCurrentChunk();
      this._setBugFixInterval();

      return true;
    }

    return false;
  }

  // Pause speech
  public pause(): boolean {
    if (this.isPlaying && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      return true;
    }
    return false;
  }

  // Resume speech
  public resume(): boolean {
    if (this.isPlaying && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      return true;
    }
    return false;
  }

  // Stop speech
  public stop(): boolean {
    this.synth.cancel();
    this.isPaused = false;
    this.isPlaying = false;
    this._clearBugFixInterval();
    return true;
  }

  // Add progress callback
  public onProgress(callback: ProgressCallback): boolean {
    if (typeof callback === "function") {
      this.progressCallbacks.push(callback);
      return true;
    }
    return false;
  }

  // Remove progress callback
  public offProgress(callback: ProgressCallback): boolean {
    const index = this.progressCallbacks.indexOf(callback);
    if (index !== -1) {
      this.progressCallbacks.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get current playing status
  public getStatus(): SpeechStatus {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentChunk: this.currentChunk + 1,
      totalChunks: this.chunks.length,
      percentage: this.chunks.length
        ? Math.round(((this.currentChunk + 1) / this.chunks.length) * 100)
        : 0,
    };
  }

  private _setBugFixInterval(): void {
    this.bugFixInterval = setInterval(() => {
      if (!this.synth.speaking) {
        clearInterval(this.bugFixInterval as NodeJS.Timeout);
      } else {
        this.synth.pause();
        this.synth.resume();
      }
    }, 14000);
  }

  private _clearBugFixInterval(): void {
    if (this.bugFixInterval) {
      clearInterval(this.bugFixInterval as NodeJS.Timeout);
    }
  }
}
