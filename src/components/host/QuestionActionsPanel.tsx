
import React from 'react';
import { Button } from "@/components/ui/button";

interface QuestionActionsPanelProps {
  onSpinWheel: () => void;
  onSelectRandomQuestion: () => void;
  hasQuestions: boolean;
}

const QuestionActionsPanel: React.FC<QuestionActionsPanelProps> = ({
  onSpinWheel,
  onSelectRandomQuestion,
  hasQuestions
}) => {
  return (
    <div className="quiz-card p-6 text-center">
      <h3 className="text-xl font-bold mb-4">Wybierz pytanie lub zakręć kołem kategorii</h3>
      <div className="flex gap-4 justify-center">
        <Button className="quiz-button" onClick={onSpinWheel}>
          Zakręć kołem
        </Button>
        {hasQuestions && (
          <Button 
            className="quiz-button-secondary"
            onClick={onSelectRandomQuestion}
            disabled={!hasQuestions}
          >
            Losowe pytanie
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionActionsPanel;
