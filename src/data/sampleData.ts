
import { Player, Question, Category, QuizRound } from '@/types';

// Przykładowe dane do prezentacji
export const sampleRounds: QuizRound[] = [
  {
    id: 1,
    name: "Runda 1: Wiedza o internecie",
    description: "Każdy gracz zaczyna z życiem 100%. Odpowiedz na pytania aby zdobyć punkty.",
    initialLives: 100,
    eliminationThreshold: 0,
  },
  {
    id: 2,
    name: "Runda 2: 5 sekund",
    description: "Każdy uczestnik ma 3 życia. Wymieniaj odpowiedzi w 5 sekund.",
    initialLives: 3,
    eliminationThreshold: 0,
  },
  {
    id: 3,
    name: "Finał",
    description: "Trzech graczy walczy o wygraną.",
    initialLives: 3,
    eliminationThreshold: 0,
  }
];

export const sampleCategories: Category[] = [
  { id: "1", name: "YouTube", color: "#FF0000" },
  { id: "2", name: "Gry i Gaming", color: "#8A2BE2" },
  { id: "3", name: "Top roku", color: "#1DB954" },
  { id: "4", name: "Pytania Pułapki", color: "#FF4500" },
  { id: "5", name: "Memy", color: "#00BFFF" },
  { id: "6", name: "Wiedza Ogólna", color: "#FFD700" },
];

export const sampleQuestions: Question[] = [
  {
    id: "q1",
    text: "Kto założył platformę YouTube?",
    categoryId: "1",
    difficulty: "easy",
    options: ["Steve Chen, Chad Hurley i Jawed Karim", "Mark Zuckerberg", "Elon Musk", "Bill Gates"],
    correctAnswer: "Steve Chen, Chad Hurley i Jawed Karim",
    points: 5,
    timeLimit: 15
  },
  {
    id: "q2",
    text: "Która gra zdobyła tytuł 'Gry Roku' na The Game Awards 2023?",
    categoryId: "2",
    difficulty: "medium",
    options: ["Baldur's Gate 3", "Hogwarts Legacy", "The Legend of Zelda: Tears of the Kingdom", "Cyberpunk 2077: Phantom Liberty"],
    correctAnswer: "Baldur's Gate 3",
    points: 10,
    timeLimit: 20
  },
  {
    id: "q3",
    text: "Co oznacza skrót 'POV' często używany w memach internetowych?",
    categoryId: "5",
    difficulty: "easy",
    options: ["Point of View", "Power of Vision", "Plenty of Value", "People over Video"],
    correctAnswer: "Point of View",
    points: 5,
    timeLimit: 15
  }
];

export const samplePlayers: Player[] = [
  { id: "p1", name: "Gracz 1", life: 100, points: 0, status: "active", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p2", name: "Gracz 2", life: 100, points: 0, status: "active", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p3", name: "Gracz 3", life: 100, points: 0, status: "active", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p4", name: "Gracz 4", life: 80, points: 15, status: "active", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p5", name: "Gracz 5", life: 70, points: 10, status: "active", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p6", name: "Gracz 6", life: 50, points: 25, status: "active", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p7", name: "Gracz 7", life: 0, points: 20, status: "lucky-loser", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p8", name: "Gracz 8", life: 0, points: 5, status: "eliminated", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p9", name: "Gracz 9", life: 0, points: 10, status: "eliminated", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
  { id: "p10", name: "Gracz 10", life: 0, points: 0, status: "eliminated", videoUrl: "https://player.twitch.tv/?channel=example&parent=localhost" },
];

// Początkowy stan gry do prezentacji
export const initialGameState = {
  currentRound: sampleRounds[0],
  players: samplePlayers,
  categories: sampleCategories,
  isRoundActive: false,
  eliminatedCount: 3,
  timeLeft: 0
};
