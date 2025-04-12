
import React from 'react';
import { QuizRound } from '@/types';

interface CurrentRoundInfoProps {
  round: QuizRound;
}

const CurrentRoundInfo: React.FC<CurrentRoundInfoProps> = ({ round }) => {
  return (
    <div className="quiz-card p-4">
      <h2 className="text-xl font-bold mb-2">
        {round.name}
      </h2>
      <p className="text-gray-300">{round.description}</p>
    </div>
  );
};

export default CurrentRoundInfo;
