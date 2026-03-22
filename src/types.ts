export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: 'Trending' | 'Originals' | 'Movies' | 'Web Series' | 'Music';
  genre: string[];
  duration: string;
  rating: number;
  releaseYear: number;
  isPremium: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  myList: string[]; // Array of content IDs
  subscriptionStatus: 'free' | 'premium';
}

export interface WatchHistory {
  userId: string;
  contentId: string;
  watchedAt: Date;
  progress: number; // in seconds
}
