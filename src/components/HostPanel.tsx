import React, { useState } from 'react';
import { 
  Player, 
  Question, 
  Category, 
  DifficultyLevel, 
  QuizRound,
  GameState
} from '@/types';
import PlayerCard from './PlayerCard';
import QuestionDisplay from './QuestionDisplay';
import CategoryWheel from './CategoryWheel';
import QuestionDataImport from './QuestionDataImport';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

// Przykladowe dane do prezentacji
const sampleRounds: QuizRound[] = [
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

const sampleCategories: Category[] = [
  { id: "1", name: "YouTube", color: "#FF0000" },
  { id: "2", name: "Gry i Gaming", color: "#8A2BE2" },
  { id: "3", name: "Top roku", color: "#1DB954" },
  { id: "4", name: "Pytania Pułapki", color: "#FF4500" },
  { id: "5", name: "Memy", color: "#00BFFF" },
  { id: "6", name: "Wiedza Ogólna", color: "#FFD700" },
];

const sampleQuestions: Question[] = [
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

const samplePlayers: Player[] = [
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
const initialGameState: GameState = {
  currentRound: sampleRounds[0],
  players: samplePlayers,
  categories: sampleCategories,
  isRoundActive: false,
  eliminatedCount: 3,
  timeLeft: 0
};

const HostPanel: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("easy");
  const [showWheel, setShowWheel] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showImport, setShowImport] = useState(false);
  
  const { toast } = useToast();

  // Zarządzanie rundami
  const startRound = (roundId: 1 | 2 | 3) => {
    const round = sampleRounds.find(r => r.id === roundId)!;
    
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

  return (
    <div className="quiz-container">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold gradient-text">Panel Prowadzącego</h1>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowImport(!showImport)}
            >
              {showImport ? "Ukryj import" : "Import pytań"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('/public', '_blank')}
            >
              Otwórz Panel Publiczny
            </Button>
          </div>
        </header>
        
        {showImport && (
          <div className="quiz-card p-4 mb-6">
            <QuestionDataImport onImportSuccess={handleImportSuccess} />
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel kontrolny po lewej */}
          <div className="lg:col-span-1 space-y-6">
            <div className="quiz-card p-4">
              <h2 className="text-xl font-bold mb-4">Rundy</h2>
              <div className="flex flex-col gap-3">
                {sampleRounds.map(round => (
                  <Button 
                    key={round.id}
                    className={`w-full justify-start ${gameState.currentRound.id === round.id && 'bg-quiz-secondary'}`}
                    onClick={() => startRound(round.id)}
                  >
                    {round.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="quiz-card p-4">
              <h2 className="text-xl font-bold mb-4">Kategorie</h2>
              <Button 
                className="w-full mb-3 quiz-button-secondary"
                onClick={spinWheel}
              >
                Zakręć kołem kategorii
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                {gameState.categories.map(category => (
                  <Button 
                    key={category.id}
                    variant="outline"
                    className={selectedCategory?.id === category.id ? 'border-quiz-accent' : ''}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
            
            {selectedCategory && (
              <div className="quiz-card p-4">
                <h2 className="text-xl font-bold mb-4">Poziom trudności</h2>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    className={selectedDifficulty === 'easy' ? 'border-quiz-accent' : ''}
                    onClick={() => setSelectedDifficulty('easy')}
                  >
                    Łatwy (5 pkt)
                  </Button>
                  <Button 
                    variant="outline"
                    className={selectedDifficulty === 'medium' ? 'border-quiz-accent' : ''}
                    onClick={() => setSelectedDifficulty('medium')}
                  >
                    Średni (10 pkt)
                  </Button>
                  <Button 
                    variant="outline"
                    className={selectedDifficulty === 'hard' ? 'border-quiz-accent' : ''}
                    onClick={() => setSelectedDifficulty('hard')}
                  >
                    Trudniejszy (15 pkt)
                  </Button>
                  <Button 
                    variant="outline"
                    className={selectedDifficulty === 'very-hard' ? 'border-quiz-accent' : ''}
                    onClick={() => setSelectedDifficulty('very-hard')}
                  >
                    Trudny (20 pkt)
                  </Button>
                </div>
              </div>
            )}
            
            {selectedCategory && getAvailableQuestions().length > 0 && (
              <div className="quiz-card p-4">
                <h2 className="text-xl font-bold mb-4">Pytania ({selectedCategory.name} - {selectedDifficulty})</h2>
                <div className="space-y-2">
                  {getAvailableQuestions().map(question => (
                    <Button 
                      key={question.id}
                      variant="outline"
                      className="w-full justify-start text-left"
                      onClick={() => selectQuestion(question)}
                    >
                      {question.text.substring(0, 30)}...
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Panel główny po prawej */}
          <div className="lg:col-span-2 space-y-6">
            {/* Obecna runda */}
            <div className="quiz-card p-4">
              <h2 className="text-xl font-bold mb-2">
                {gameState.currentRound.name}
              </h2>
              <p className="text-gray-300">{gameState.currentRound.description}</p>
            </div>
            
            {/* Koło kategorii lub pytanie */}
            {showWheel ? (
              <div className="quiz-card p-6 flex justify-center">
                <CategoryWheel 
                  categories={gameState.categories}
                  onSelect={handleCategorySelect}
                  isSpinning={isSpinning}
                />
              </div>
            ) : selectedQuestion ? (
              <QuestionDisplay
                question={selectedQuestion}
                onAnswer={handleAnswer}
                timeLeft={gameState.timeLeft}
              />
            ) : (
              <div className="quiz-card p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Wybierz pytanie lub zakręć kołem kategorii</h3>
                <div className="flex gap-4 justify-center">
                  <Button className="quiz-button" onClick={spinWheel}>
                    Zakręć kołem
                  </Button>
                  {selectedCategory && (
                    <Button 
                      className="quiz-button-secondary"
                      onClick={() => getAvailableQuestions().length > 0 && selectQuestion(getAvailableQuestions()[0])}
                      disabled={getAvailableQuestions().length === 0}
                    >
                      Losowe pytanie
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Gracze */}
            <div className="quiz-card p-4">
              <h2 className="text-xl font-bold mb-4">
                Gracze <span className="text-sm text-gray-400">({gameState.players.filter(p => p.status !== 'eliminated').length} aktywnych)</span>
              </h2>
              
              <Tabs defaultValue="active">
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Aktywni</TabsTrigger>
                  <TabsTrigger value="all">Wszyscy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gameState.players
                      .filter(p => p.status !== 'eliminated')
                      .map(player => (
                        <PlayerCard 
                          key={player.id} 
                          player={player} 
                          isActive={player.id === gameState.currentPlayerId}
                        />
                      ))
                    }
                  </div>
                </TabsContent>
                
                <TabsContent value="all">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {gameState.players.map(player => (
                      <PlayerCard 
                        key={player.id} 
                        player={player} 
                        isActive={player.id === gameState.currentPlayerId}
                        isCompact={true}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostPanel;
