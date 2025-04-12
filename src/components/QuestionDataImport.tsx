
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { parseQuestionData, generateCategories } from '@/utils/questionParser';
import { Question, Category } from '@/types';

interface QuestionDataImportProps {
  onImportSuccess: (questions: Question[], categories: Category[]) => void;
}

const QuestionDataImport: React.FC<QuestionDataImportProps> = ({ onImportSuccess }) => {
  const [rawData, setRawData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = () => {
    if (!rawData.trim()) {
      toast({
        title: "Błąd",
        description: "Wprowadź dane pytań",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Parse the data
      const { questions, categories } = parseQuestionData(rawData);
      
      if (questions.length === 0) {
        throw new Error("Nie udało się przetworzyć pytań. Sprawdź format danych.");
      }
      
      // Generate categories
      const categoryObjects = generateCategories(categories);
      
      // Call the callback with the parsed data
      onImportSuccess(questions, categoryObjects);
      
      toast({
        title: "Sukces!",
        description: `Zaimportowano ${questions.length} pytań w ${categories.size} kategoriach.`
      });
      
      // Clear the textarea
      setRawData('');
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Błąd importu",
        description: error instanceof Error ? error.message : "Nie udało się przetworzyć danych",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Import pytań</h2>
      <Textarea
        placeholder="Wklej tutaj surowe dane pytań..."
        value={rawData}
        onChange={(e) => setRawData(e.target.value)}
        className="min-h-[200px]"
      />
      <Button 
        onClick={handleImport} 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Importowanie..." : "Importuj pytania"}
      </Button>
    </div>
  );
};

export default QuestionDataImport;
