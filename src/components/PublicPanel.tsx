
import React, { useState, useEffect } from 'react';
import { Question, Player, Category } from '@/types';
import PlayerCard from './PlayerCard';
import QuestionDisplay from './QuestionDisplay';
import VideoGrid from './VideoGrid';
import CategoryWheel from './CategoryWheel';

// Przykładowe dane takie same jak w HostPanel dla prezentacji
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

const sampleQuestion: Question = {
  id: "q1",
  text: "Kto założył platformę YouTube?",
  categoryId: "1",
  difficulty: "easy",
  options: ["Steve Chen, Chad Hurley i Jawed Karim", "Mark Zuckerberg", "Elon Musk", "Bill Gates"],
  correctAnswer: "Steve Chen, Chad Hurley i Jawed Karim",
  points: 5,
  timeLimit: 15
};

const sampleCategories: Category[] = [
  { id: "1", name: "YouTube", color: "#FF0000" },
  { id: "2", name: "Gry i Gaming", color: "#8A2BE2" },
  { id: "3", name: "Top roku", color: "#1DB954" },
  { id: "4", name: "Pytania Pułapki", color: "#FF4500" },
  { id: "5", name: "Memy", color: "#00BFFF" },
  { id: "6", name: "Wiedza Ogólna", color: "#FFD700" },
];

const PublicPanel: React.FC = () => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showQuestionResult, setShowQuestionResult] = useState(false);
  const [questionResult, setQuestionResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showWheel, setShowWheel] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState("p4");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Symulacja interakcji dla prezentacji
  useEffect(() => {
    const demoSequence = async () => {
      // Symulacja wyświetlenia pytania
      setTimeout(() => {
        setShowQuestion(true);
        setTimeLeft(15);
        
        // Odliczanie czasu
        const interval = setInterval(() => {
          setTimeLeft(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        // Symulacja wyniku po 10 sekundach
        setTimeout(() => {
          clearInterval(interval);
          setShowQuestionResult(true);
          setQuestionResult('correct');
          
          // Ukrycie wyniku po 3 sekundach
          setTimeout(() => {
            setShowQuestion(false);
            setShowQuestionResult(false);
            
            // Symulacja kręcenia kołem po ukryciu wyniku
            setTimeout(() => {
              setShowWheel(true);
              
              // Ukrycie koła po 6 sekundach
              setTimeout(() => {
                setShowWheel(false);
                
                // Powtórzenie demoSequence
                setTimeout(demoSequence, 5000);
              }, 6000);
            }, 2000);
          }, 3000);
        }, 10000);
      }, 3000);
    };
    
    // Rozpocznij sekwencję po 5 sekundach
    const initialTimeout = setTimeout(demoSequence, 5000);
    
    return () => {
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <div className="quiz-container overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
            Internet Quiz Arena
          </h1>
        </header>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Główny panel z pytaniem lub kołem */}
          <div className="relative">
            {showWheel && (
              <div className="quiz-card p-6 flex justify-center animate-fade-in">
                <CategoryWheel 
                  categories={sampleCategories}
                  onSelect={() => {}}
                  isSpinning={true}
                />
              </div>
            )}
            
            {showQuestion && (
              <div className="animate-fade-in">
                <QuestionDisplay
                  question={sampleQuestion}
                  onAnswer={() => {}}
                  showResult={showQuestionResult}
                  result={questionResult || undefined}
                  timeLeft={timeLeft || undefined}
                />
              </div>
            )}
            
            {!showQuestion && !showWheel && (
              <div className="quiz-card p-6 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 gradient-text">
                  Trwa runda 1: Wiedza z polskiego internetu
                </h2>
                <p className="text-xl mb-6">
                  Kolejny gracz: <span className="font-bold">{samplePlayers.find(p => p.id === currentPlayerId)?.name}</span>
                </p>
                <div className="w-full max-w-md">
                  <PlayerCard 
                    player={samplePlayers.find(p => p.id === currentPlayerId)!} 
                    isActive={true}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Panel z graczami */}
          <div className="quiz-card p-4">
            <h2 className="text-xl font-bold mb-4">Gracze</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-3">
              {samplePlayers
                .filter(p => p.status !== 'eliminated')
                .map(player => (
                  <PlayerCard 
                    key={player.id} 
                    player={player} 
                    isActive={player.id === currentPlayerId}
                    isCompact={true}
                  />
                ))
              }
            </div>
          </div>
          
          {/* Panel z kamerami */}
          <div className="quiz-card p-4">
            <h2 className="text-xl font-bold mb-4">Kamery uczestników</h2>
            <VideoGrid 
              players={samplePlayers.filter(p => p.status !== 'eliminated')} 
              hostVideoUrl="https://player.twitch.tv/?channel=example&parent=localhost"
              currentPlayerId={currentPlayerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPanel;
