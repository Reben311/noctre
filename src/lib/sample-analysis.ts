export interface SongMatch {
  title: string;
  artist: string;
  why: string;
  matchPercent: number;
  category: string;
  bestForStory: boolean;
}

export interface VibeAnalysis {
  vibeReading: string;
  mood: {
    emotionalTone: string;
    energyLevel: string;
    socialVibe: string;
    visualTemperature: string;
    confidence: number;
    chill: number;
    hype: number;
    melancholy: number;
  };
  aesthetics: string[];
  topMatches: SongMatch[];
  moreRecommendations: SongMatch[];
  captions: {
    short: string[];
    classy: string[];
    playful: string[];
    minimalist: string[];
  };
  postingSuggestion: string;
}

export const SAMPLE_ANALYSIS: VibeAnalysis = {
  vibeReading:
    "Soft golden-hour nostalgia with a confident, cinematic, low-key romantic energy — the kind of frame that feels like the opening shot of an indie film.",
  mood: {
    emotionalTone: "Warm, dreamy, quietly confident",
    energyLevel: "mellow",
    socialVibe: "main character moment, intimate luxe",
    visualTemperature: "warm",
    confidence: 82,
    chill: 74,
    hype: 28,
    melancholy: 36,
  },
  aesthetics: ["golden hour", "soft luxury", "cinematic travel", "clean girl"],
  topMatches: [
    { title: "Sunset Lover", artist: "Petit Biscuit", why: "Floats with the same warm, suspended-time feeling.", matchPercent: 96, category: "Soft / Chill", bestForStory: true },
    { title: "Cherry Wine", artist: "Hozier", why: "Romantic, sun-drenched, slightly bittersweet.", matchPercent: 93, category: "Romantic", bestForStory: true },
    { title: "Pretty Girl", artist: "Clairo", why: "Effortless main-character softness.", matchPercent: 91, category: "Main Character", bestForStory: true },
    { title: "Glimpse of Us", artist: "Joji", why: "For the cinematic, longing undertone.", matchPercent: 88, category: "Sad / Reflective", bestForStory: false },
    { title: "Ditto", artist: "NewJeans", why: "Trendy nostalgia with golden energy.", matchPercent: 86, category: "Trendy / Viral", bestForStory: true },
  ],
  moreRecommendations: [
    { title: "Sweater Weather", artist: "The Neighbourhood", why: "Cozy, romantic-cool.", matchPercent: 84, category: "Cool / Confident", bestForStory: false },
    { title: "Mariposa", artist: "Peach Tree Rascals", why: "Bright, breezy main character.", matchPercent: 82, category: "Main Character", bestForStory: true },
    { title: "Pink + White", artist: "Frank Ocean", why: "Sun-soaked elegance.", matchPercent: 89, category: "Soft / Chill", bestForStory: true },
    { title: "Best Part", artist: "Daniel Caesar", why: "Tender and intimate.", matchPercent: 85, category: "Romantic", bestForStory: false },
    { title: "Hayloft II", artist: "Mother Mother", why: "For drama; alt-trend.", matchPercent: 71, category: "Trendy / Viral", bestForStory: false },
    { title: "Mundo", artist: "IV of Spades", why: "OPM warmth, classic feel.", matchPercent: 87, category: "OPM", bestForStory: true },
    { title: "Snooze", artist: "SZA", why: "Confident, dreamy R&B.", matchPercent: 83, category: "Cool / Confident", bestForStory: true },
    { title: "Cool With You", artist: "NewJeans", why: "Soft, viral, golden.", matchPercent: 84, category: "Trendy / Viral", bestForStory: true },
    { title: "Lover", artist: "Taylor Swift", why: "For pure romantic glow.", matchPercent: 80, category: "Romantic", bestForStory: false },
    { title: "After Dark", artist: "Mr.Kitty", why: "If you want a moodier flip.", matchPercent: 68, category: "Sad / Reflective", bestForStory: false },
  ],
  captions: {
    short: ["golden, slow, mine", "soft hours", "no notes."],
    classy: ["The light always finds the right people.", "Quiet days, loud feelings.", "An ordinary evening, beautifully kept."],
    playful: ["main character behavior, casually 🌅", "yes the light was free", "told the sun to pose with me"],
    minimalist: ["sun-kissed", "kept it soft", "warm, still, here"],
  },
  postingSuggestion:
    "Best posted with a soft fade story style and a single short text overlay — let the song carry the emotion.",
};
