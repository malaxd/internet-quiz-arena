
import React from 'react';
import { QuizRound } from '@/types';
import { Button } from "@/components/ui/button";

interface RoundSelectorProps {
  rounds: QuizRound[];
  currentRoundId: number;
  onStartRound: (roundId: 1 | 2 | 3) => void;
}

const RoundSelector: React.FC<RoundSelectorProps> = ({
  rounds,
  currentRoundId,
  onStartRound
}) => {
  return (
    <div className="quiz-card p-4">
      <h2 className="text-xl font-bold mb-4">Rundy</h2>
      <div className="flex flex-col gap-3">
        {rounds.map(round => (
          <Button 
            key={round.id}
            className={`w-full justify-start ${currentRoundId === round.id && 'bg-quiz-secondary'}`}
            onClick={() => onStartRound(round.id)}
          >
            {round.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RoundSelector;
