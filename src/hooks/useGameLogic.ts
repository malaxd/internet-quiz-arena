
import { useState, useEffect } from 'react';
import { 
  Player, 
  Question, 
  Category, 
  DifficultyLevel, 
  QuizRound,
  GameState
} from '@/types';
import { useToast } from "@/hooks/use-toast";

export const useGameLogic = (
  initialState: GameState, 
  initialQuestions: Question[]
) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("easy");
  const [showWheel, setShowWheel] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showImport, setShowImport] = useState(false);
  
  const { toast } = useToast();

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  // Zarządzanie rundami
  const startRound = (roundId: 1 | 2 | 3) => {
    const round = gameState.currentRound.id === roundId 
      ? gameState.currentRound 
      : initialState.currentRound;
    
    // Reset graczy zgodnie z regułami danej rundy
    let updatedPlayers = [...gameState.players];
    
    if (roundId === 1) {
      // Wszyscy zaczynają od pełnego życia
      updatedPlayers = updatedPlayers.map(p => ({
        ...p,
        life: 100,
        points: 0,
        status: "active"
      }));
    } else if (roundId === 2) {
      // Tylko 6 graczy z najwyższym życiem/punktami
      const sortedPlayers = [...gameState.players]
        .sort((a, b) => {
          if (a.life !== b.life) return b.life - a.life;
          return b.points - a.points;
        });
      
      const topPlayers = sortedPlayers.slice(0, 5);
      
      // Znajdź "lucky loser" - gracz z 0% życia ale największą liczbą punktów
      const luckyLoser = sortedPlayers
        .filter(p => p.life === 0)
        .sort((a, b) => b.points - a.points)[0];
      
      if (luckyLoser && luckyLoser.points >= 15) {
        updatedPlayers = [...topPlayers, {...luckyLoser, status: "lucky-loser"}];
      } else {
        updatedPlayers = topPlayers;
      }
      
      // Ustaw 3 życia każdemu graczowi
      updatedPlayers = updatedPlayers.map(p => ({
        ...p,
        life: 3,
        status: p.status === "lucky-loser" ? "lucky-loser" : "active"
      }));
    } else if (roundId === 3) {
      // 3 najlepszych graczy z rundy 2
      const finalists = gameState.players
        .filter(p => p.status !== "eliminated")
        .sort((a, b) => b.life - a.life)
        .slice(0, 3);
      
      updatedPlayers = finalists.map(p => ({
        ...p,
        life: 3,
        status: "active"
      }));
    }
    
    setGameState({
      ...gameState,
      currentRound: round,
      players: updatedPlayers,
      isRoundActive: true,
      activeQuestion: undefined,
      currentPlayerId: updatedPlayers[0]?.id,
      timeLeft: 0
    });
    
    toast({
      title: `Rozpoczęto: ${round.name}`,
      description: round.description
    });
  };

  // Zarządzanie pytaniami
  const getAvailableQuestions = () => {
    if (!selectedCategory) return [];
    
    return questions.filter(
      q => q.categoryId === selectedCategory.id && 
           q.difficulty === selectedDifficulty
    );
  };

  const selectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setGameState({
      ...gameState,
      activeQuestion: question,
      timeLeft: question.timeLimit
    });
    
    // Rozpocznij odliczanie
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft && prev.timeLeft > 0) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        } else {
          clearInterval(newTimer);
          return { ...prev, timeLeft: 0 };
        }
      });
    }, 1000);
    
    setTimer(newTimer);
  };

  const handleAnswer = (answer: string) => {
    if (!selectedQuestion || !gameState.currentPlayerId) return;
    
    // Zatrzymaj timer
    if (timer) clearInterval(timer);
    
    const isCorrect = answer === selectedQuestion.correctAnswer;
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayerId);
    
    if (!currentPlayer) return;
    
    // Aktualizuj gracza w zależności od rundy
    const updatedPlayers = gameState.players.map(p => {
      if (p.id !== gameState.currentPlayerId) return p;
      
      if (gameState.currentRound.id === 1) {
        // W rundzie 1 tracimy % życia za błąd
        const lifeLoss = selectedQuestion.points <= 10 ? 10 : 20;
        const newLife = isCorrect ? p.life : Math.max(0, p.life - lifeLoss);
        const newPoints = isCorrect ? p.points + selectedQuestion.points : p.points;
        const newStatus = newLife === 0 ? "eliminated" : p.status;
        
        return {
          ...p,
          life: newLife,
          points: newPoints,
          status: newStatus
        };
      } else {
        // W rundach 2 i 3 tracimy 1 życie za błąd
        const newLife = isCorrect ? p.life : p.life - 1;
        const newStatus = newLife === 0 ? "eliminated" : p.status;
        
        return {
          ...p,
          life: newLife,
          status: newStatus
        };
      }
    });
    
    // Znajdź następnego aktywnego gracza
    const activePlayers = updatedPlayers.filter(p => p.status !== "eliminated");
    let nextPlayerIndex = 0;
    
    if (activePlayers.length > 1) {
      const currentIndex = activePlayers.findIndex(p => p.id === gameState.currentPlayerId);
      nextPlayerIndex = (currentIndex + 1) % activePlayers.length;
    }
    
    const eliminatedCount = updatedPlayers.filter(p => p.status === "eliminated").length;
    
    // Sprawdź czy runda się skończyła
    const isRoundFinished = gameState.currentRound.id === 1 
      ? eliminatedCount >= 5
      : activePlayers.length <= 1;
    
    // Aktualizuj stan gry
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentPlayerId: activePlayers[nextPlayerIndex]?.id,
      eliminatedCount,
      isRoundActive: !isRoundFinished,
      winnerId: isRoundFinished && activePlayers.length === 1 ? activePlayers[0].id : undefined
    });
    
    if (isRoundFinished) {
      toast({
        title: "Runda zakończona",
        description: gameState.currentRound.id < 3 
          ? "Przejdź do następnej rundy." 
          : "Gratulacje dla zwycięzcy!"
      });
    }
    
    // Pokaż wynik przez 2 sekundy, potem resetuj
    setTimeout(() => {
      setSelectedQuestion(null);
    }, 2000);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setShowWheel(false);
    setIsSpinning(false);
    
    toast({
      title: "Wybrano kategorię",
      description: `Kategoria: ${category.name}`
    });
  };

  const spinWheel = () => {
    setShowWheel(true);
    setIsSpinning(true);
  };

  const handleImportSuccess = (newQuestions: Question[], newCategories: Category[]) => {
    setQuestions(newQuestions);
    setGameState(prev => ({
      ...prev,
      categories: newCategories
    }));
    setShowImport(false);
    
    toast({
      title: "Pytania zaimportowane",
      description: `Dodano ${newQuestions.length} pytań w ${newCategories.length} kategoriach.`
    });
  };

  const toggleImport = () => {
    setShowImport(!showImport);
  };

  return {
    gameState,
    questions,
    selectedQuestion,
    selectedCategory,
    selectedDifficulty,
    showWheel,
    isSpinning,
    showImport,
    getAvailableQuestions,
    startRound,
    selectQuestion,
    handleAnswer,
    handleCategorySelect,
    spinWheel,
    setSelectedDifficulty,
    handleImportSuccess,
    toggleImport
  };
};
