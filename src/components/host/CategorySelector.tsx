
import React from 'react';
import { Category } from '@/types';
import { Button } from "@/components/ui/button";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onSpinWheel: () => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onSpinWheel
}) => {
  return (
    <div className="quiz-card p-4">
      <h2 className="text-xl font-bold mb-4">Kategorie</h2>
      <Button 
        className="w-full mb-3 quiz-button-secondary"
        onClick={onSpinWheel}
      >
        Zakręć kołem kategorii
      </Button>
      
      <div className="grid grid-cols-2 gap-2">
        {categories.map(category => (
          <Button 
            key={category.id}
            variant="outline"
            className={selectedCategory?.id === category.id ? 'border-quiz-accent' : ''}
            onClick={() => onSelectCategory(category)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
