
export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  life: number;
  points: number;
  status: 'active' | 'eliminated' | 'winner' | 'lucky-loser';
  videoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'very-hard';

export interface Question {
  id: string;
  text: string;
  categoryId: string;
  difficulty: DifficultyLevel;
  options?: string[];
  correctAnswer: string;
  points: 5 | 10 | 15 | 20;
  timeLimit: number;
}

export interface QuizRound {
  id: 1 | 2 | 3; // 1: Pierwsza runda, 2: Druga runda, 3: Finał
  name: string;
  description: string;
  initialLives: number;
  eliminationThreshold: number;
}

export interface GameState {
  currentRound: QuizRound;
  players: Player[];
  categories: Category[];
  activeQuestion?: Question;
  isRoundActive: boolean;
  currentPlayerId?: string;
  timeLeft?: number;
  eliminatedCount: number;
  winnerId?: string;
}
