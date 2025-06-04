// Human cognitive and processing speeds (averages)
// ! Sources needing verification and upgrade to root publications needed - acting as base for approximate values

export const HUMAN_INFO = {
  // Reading speeds (words per minute)
  READING_SPEED: {
    SLOW: 200, // Slow reader - Average slow reading speed for adults
    // Source: https://speechify.com/blog/average-reading-speed-pages/
    // Source: https://thereadtime.com/
    AVERAGE: 250, // Average adult reading speed - Commonly cited average reading speed for adults
    // Source: https://speechify.com/blog/average-reading-speed-pages/
    // Source: https://thereadtime.com/
    // Source: https://www.forbes.com/sites/brettnelson/2012/06/04/do-you-read-fast-enough-to-be-successful/
    FAST: 400, // Fast reader - Upper range for fast readers
    // Source: https://thereadtime.com/reading-speed-test/
    SPEED_READER: 700, // Speed reading techniques - Speed reading can exceed normal comprehension limits
    // Source: https://en.wikipedia.org/wiki/Speed_reading
  },

  // Visual processing speeds (milliseconds)
  VIEW_SPEED: {
    VISUAL_RECOGNITION: 100, // milliseconds to recognize an object - Time to recognize simple objects
    // Source: https://photutorial.com/images-60000-times-faster-text-myth/
    FACIAL_RECOGNITION: 170, // milliseconds to recognize a face - Time to recognize faces
    // Source: https://photutorial.com/images-60000-times-faster-text-myth/
    TEXT_RECOGNITION: 150, // milliseconds to recognize text - Time to recognize text visually
    // Source: https://photutorial.com/images-60000-times-faster-text-myth/
    IMAGE_PROCESSING: 13, // milliseconds per frame (can process ~77 fps) - Processing speed for images per frame
    // Source: https://caseguard.com/articles/how-many-frames-per-second-can-the-human-eye-see/
    // Source: https://www.emailaudience.com/research-picture-worth-1000-words-marketing/
  },

  // Audio processing speeds (words per minute)
  LISTENING_SPEED: {
    COMFORTABLE: 150, // words per minute (comfortable listening) - Comfortable listening speed
    // Source: https://www.omnicalculator.com/everyday-life/words-per-minute
    AVERAGE: 180, // words per minute (average speech comprehension) - Average speech comprehension speed
    // Source: https://www.omnicalculator.com/everyday-life/words-per-minute
    FAST: 220, // words per minute (fast speech comprehension) - Fast speech comprehension speed
    // Source: https://www.write-out-loud.com/speech-rate.html
    MAXIMUM: 400, // words per minute (maximum with good comprehension) - Maximum comprehension speed for trained listeners
    // Source: https://www.write-out-loud.com/speech-rate.html
  },

  // General processing speeds (milliseconds)
  PROCESS_SPEED: {
    REACTION_TIME: 250, // milliseconds (average simple reaction time) - Average simple reaction time
    // Source: https://en.wikipedia.org/wiki/Mental_chronometry
    COMPLEX_REACTION: 500, // milliseconds (complex decision making) - Complex decision-making reaction time
    TYPING_SPEED: 40, // words per minute (average typing speed) - Average typing speed for adults
    // Source: https://en.wikipedia.org/wiki/Words_per_minute
    MEMORY_RECALL: 600, // milliseconds (short-term memory recall) - Short-term memory recall time
    ATTENTION_SPAN: 8, // seconds (average attention span in seconds) - Average attention span duration
    DECISION_MAKING: 2000, // milliseconds (simple decision making) - Simple decision-making time
  },

  // Cognitive limits
  COGNITIVE_LIMITS: {
    SHORT_TERM_MEMORY: 7, // items (Miller's magic number ±2) - Short-term memory capacity based on Miller's Law
    // Source: https://en.wikipedia.org/wiki/Cognitive_load
    // Source: https://neurolaunch.com/cognitive-limitations/
    WORKING_MEMORY: 4, // chunks of information - Typical working memory capacity
    // Source: https://florian-kraemer.net/software-architecture/2024/07/25/The-Limits-of-Human-Cognitive-Capacities-in-Programming.html
    MULTITASKING_EFFICIENCY: 0.6, // efficiency drop when multitasking (40% loss) - Efficiency drop during multitasking
  },

  // Time-based constants (milliseconds)
  TIME_PERCEPTION: {
    PRESENT_MOMENT: 3000, // milliseconds (duration of "now") - Duration of the perceived present moment
    // Source: https://en.wikipedia.org/wiki/Time_perception
    SHORT_TERM: 30000, // milliseconds (30 seconds - short-term events) - Short-term memory duration
    OPTIMAL_BREAK: 900000, // milliseconds (15 minutes - optimal break time) - Optimal break time for sustained attention
  },

  // Diary infos
  DIARY_INPUTS: {
    PERSONAL: 2500, // Average 200 to 500 words
    THERAPEUTIC: 1500, // Shorter with goals 100 to 300 words,
    ACADEMIC: 5000, // Detailled observations 500 to 1000+ words
  },
} as const;

// Helper functions for calculations
export const calculateReadingTime = (
  wordCount: number,
  speed: number = HUMAN_INFO.READING_SPEED.AVERAGE
): number => {
  return Math.ceil((wordCount / speed) * 60); // returns time in seconds
};

export const calculateListeningTime = (
  wordCount: number,
  speed: number = HUMAN_INFO.LISTENING_SPEED.AVERAGE
): number => {
  return Math.ceil((wordCount / speed) * 60); // returns time in seconds
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return minutes > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${remainingSeconds}s`;
};

// Type definitions for better TypeScript support
export type ReadingSpeedType = keyof typeof HUMAN_INFO.READING_SPEED;
export type ListeningSpeedType = keyof typeof HUMAN_INFO.LISTENING_SPEED;
export type ProcessSpeedType = keyof typeof HUMAN_INFO.PROCESS_SPEED;
