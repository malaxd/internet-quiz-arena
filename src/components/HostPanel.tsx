import React, { useState, useEffect } from 'react';
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

  // Timer logic
  const [timer, setTimer] = useState(30); // Start at 30 seconds
  const [isRunning, setIsRunning] = useState(false); // Timer state

  // Start timer
  const startTimer = () => setIsRunning(true);

  // Stop timer
  const stopTimer = () => setIsRunning(false);

  // Reset timer
  const resetTimer = () => {
    setTimer(30); // Reset to 30 seconds
    setIsRunning(false); // Stop timer
  };

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false); // Stop timer when it reaches 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [isRunning]);

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

        {/* Add Timer Panel */}
        <div className="timer-panel mb-6">
          <h2 className="text-xl">Czas: {timer}s</h2>
          <div className="flex gap-3 mt-2">
            <Button onClick={startTimer} disabled={isRunning}>Start Timer</Button>
            <Button onClick={stopTimer} disabled={!isRunning}>Stop Timer</Button>
            <Button onClick
              
