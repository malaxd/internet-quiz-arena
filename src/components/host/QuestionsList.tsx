
import React from 'react';
import { Question, Category } from '@/types';
import { Button } from "@/components/ui/button";

interface QuestionsListProps {
  questions: Question[];
  selectedCategory: Category;
  onSelectQuestion: (question: Question) => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  selectedCategory,
  onSelectQuestion
}) => {
  if (questions.length === 0) {
    return (
      <div className="quiz-card p-4">
        <h2 className="text-xl font-bold mb-4">Brak pytań w tej kategorii</h2>
      </div>
    );
  }

  return (
    <div className="quiz-card p-4">
      <h2 className="text-xl font-bold mb-4">
        Pytania ({selectedCategory.name} - {questions[0].difficulty})
      </h2>
      <div className="space-y-2">
        {questions.map(question => (
          <Button 
            key={question.id}
            variant="outline"
            className="w-full justify-start text-left"
            onClick={() => onSelectQuestion(question)}
          >
            {question.text.substring(0, 30)}...
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionsList;
