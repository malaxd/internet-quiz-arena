
import React from 'react';
import { Button } from "@/components/ui/button";
import QuestionDisplay from './QuestionDisplay';
import CategoryWheel from './CategoryWheel';
import QuestionDataImport from './QuestionDataImport';

// Import components
import RoundSelector from './host/RoundSelector';
import CategorySelector from './host/CategorySelector';
import DifficultySelector from './host/DifficultySelector';
import QuestionsList from './host/QuestionsList';
import CurrentRoundInfo from './host/CurrentRoundInfo';
import QuestionActionsPanel from './host/QuestionActionsPanel';
import PlayersPanel from './host/PlayersPanel';

// Import hooks and data
import { useGameLogic } from '@/hooks/useGameLogic';
import { sampleRounds, sampleQuestions, initialGameState } from '@/data/sampleData';

const HostPanel: React.FC = () => {
  const {
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
  } = useGameLogic(initialGameState, sampleQuestions);

  const availableQuestions = getAvailableQuestions();

  return (
    <div className="quiz-container">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold gradient-text">Panel Prowadzącego</h1>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={toggleImport}
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
            <RoundSelector 
              rounds={sampleRounds}
              currentRoundId={gameState.currentRound.id}
              onStartRound={startRound}
            />
            
            <CategorySelector 
              categories={gameState.categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSpinWheel={spinWheel}
            />
            
            {selectedCategory && (
              <DifficultySelector 
                selectedDifficulty={selectedDifficulty}
                onSelectDifficulty={setSelectedDifficulty}
              />
            )}
            
            {selectedCategory && availableQuestions.length > 0 && (
              <QuestionsList 
                questions={availableQuestions}
                selectedCategory={selectedCategory}
                onSelectQuestion={selectQuestion}
              />
            )}
          </div>
          
          {/* Panel główny po prawej */}
          <div className="lg:col-span-2 space-y-6">
            {/* Obecna runda */}
            <CurrentRoundInfo round={gameState.currentRound} />
            
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
              <QuestionActionsPanel 
                onSpinWheel={spinWheel}
                onSelectRandomQuestion={() => {
                  if (availableQuestions.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                    selectQuestion(availableQuestions[randomIndex]);
                  }
                }}
                hasQuestions={availableQuestions.length > 0}
              />
            )}
            
            {/* Gracze */}
            <PlayersPanel 
              players={gameState.players}
              currentPlayerId={gameState.currentPlayerId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostPanel;
