
import React, { useState, useEffect } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (answer: string) => void;
  showResult?: boolean;
  result?: 'correct' | 'incorrect';
  timeLeft?: number;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
  showResult = false,
  result,
  timeLeft
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // Reset selection when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [question.id]);

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const getDifficultyLabel = () => {
    switch (question.difficulty) {
      case 'easy': return 'Łatwe';
      case 'medium': return 'Średnie';
      case 'hard': return 'Trudniejsze';
      case 'very-hard': return 'Trudne';
    }
  };

  const getPointsLabel = () => {
    return `${question.points} pkt`;
  };

  const getAnswerClasses = (answer: string) => {
    if (!showResult) {
      return cn(
        "p-4 border rounded-lg transition-all duration-200 cursor-pointer",
        selectedAnswer === answer 
          ? "border-quiz-accent bg-quiz-primary/50 shadow-neon" 
          : "border-gray-700 bg-quiz-card hover:border-quiz-secondary"
      );
    }
    
    if (answer === question.correctAnswer) {
      return "p-4 border border-quiz-success bg-quiz-success/20 rounded-lg";
    }
    
    if (selectedAnswer === answer && answer !== question.correctAnswer) {
      return "p-4 border border-quiz-danger bg-quiz-danger/20 rounded-lg";
    }
    
    return "p-4 border border-gray-700 bg-quiz-card rounded-lg opacity-50";
  };

  return (
    <div className="quiz-card p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="bg-quiz-primary px-3 py-1 rounded text-sm">
            {getDifficultyLabel()}
          </span>
          <span className="bg-quiz-secondary px-3 py-1 rounded text-sm">
            {getPointsLabel()}
          </span>
        </div>
        
        {timeLeft !== undefined && (
          <div className={cn(
            "text-lg font-bold px-3 py-1 rounded-full",
            timeLeft <= 5 ? "bg-quiz-danger animate-pulse" : "bg-quiz-primary"
          )}>
            {timeLeft}s
          </div>
        )}
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold mb-8">{question.text}</h3>
      
      {question.options ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={getAnswerClasses(option)}
              onClick={() => handleSelectAnswer(option)}
            >
              {option}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 border border-gray-700 rounded-lg">
          <p className="text-center text-gray-400 italic">To pytanie wymaga odpowiedzi bez podpowiedzi</p>
        </div>
      )}
      
      {showResult && (
        <div className={cn(
          "mt-6 p-4 rounded-lg text-center font-bold",
          result === 'correct' ? "bg-quiz-success/20 text-quiz-success" : "bg-quiz-danger/20 text-quiz-danger"
        )}>
          {result === 'correct' ? 'Poprawna odpowiedź!' : 'Niepoprawna odpowiedź!'}
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
