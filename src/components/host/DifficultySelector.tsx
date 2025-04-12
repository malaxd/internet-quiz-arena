
import React from 'react';
import { DifficultyLevel } from '@/types';
import { Button } from "@/components/ui/button";

interface DifficultySelectorProps {
  selectedDifficulty: DifficultyLevel;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onSelectDifficulty
}) => {
  return (
    <div className="quiz-card p-4">
      <h2 className="text-xl font-bold mb-4">Poziom trudności</h2>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline"
          className={selectedDifficulty === 'easy' ? 'border-quiz-accent' : ''}
          onClick={() => onSelectDifficulty('easy')}
        >
          Łatwy (5 pkt)
        </Button>
        <Button 
          variant="outline"
          className={selectedDifficulty === 'medium' ? 'border-quiz-accent' : ''}
          onClick={() => onSelectDifficulty('medium')}
        >
          Średni (10 pkt)
        </Button>
        <Button 
          variant="outline"
          className={selectedDifficulty === 'hard' ? 'border-quiz-accent' : ''}
          onClick={() => onSelectDifficulty('hard')}
        >
          Trudniejszy (15 pkt)
        </Button>
        <Button 
          variant="outline"
          className={selectedDifficulty === 'very-hard' ? 'border-quiz-accent' : ''}
          onClick={() => onSelectDifficulty('very-hard')}
        >
          Trudny (20 pkt)
        </Button>
      </div>
    </div>
  );
};

export default DifficultySelector;
