
import { Question, Category, DifficultyLevel } from '@/types';

// Function to parse the raw question data
export const parseQuestionData = (rawData: string): { questions: Question[], categories: Set<string> } => {
  try {
    // Clean up and parse the data
    const cleanData = rawData
      .replace(/\[\s*""\s*,\s*"\[\[\[\{"\s*,/g, '[{')
      .replace(/\}\]\],\[\{/g, '},{')
      .replace(/"\s*,\s*"/g, '":"')
      .replace(/"\s*\}\s*,\s*\{"/g, '"},{"')
      .replace(/"\s*\}\s*,\s*\]"/g, '"}]')
      .replace(/"\s*\]\s*,\s*"/g, '","')
      .replace(/"\s*\{\s*"/g, '{"')
      .replace(/\}\s*\]\s*\]\s*\]/g, '}]');
    
    // Try to parse the JSON
    const parsedData = JSON.parse(cleanData);
    
    // Track unique categories
    const categories = new Set<string>();
    
    // Convert to our Question format
    const questions: Question[] = parsedData.map((item: any, index: number) => {
      // Add category to the set
      categories.add(item.kategoria.toLowerCase());
      
      // Map difficulty values
      let difficulty: DifficultyLevel = "easy";
      let points: 5 | 10 | 15 | 20 = 5;
      
      switch(item.trudnosc) {
        case 5:
          difficulty = "easy";
          points = 5;
          break;
        case 10:
          difficulty = "medium";
          points = 10;
          break;
        case 15:
          difficulty = "hard";
          points = 15;
          break;
        case 20:
          difficulty = "very-hard";
          points = 20;
          break;
      }
      
      // Create question object
      const question: Question = {
        id: `q${index}`,
        text: item.pytanie,
        categoryId: item.kategoria.toLowerCase(),
        difficulty,
        correctAnswer: item.poprawna_odpowiedz,
        points,
        timeLimit: difficulty === "easy" ? 15 : difficulty === "medium" ? 20 : 30
      };
      
      // Add options if available
      if (item.odpowiedzi || item.warianty) {
        question.options = item.odpowiedzi || item.warianty;
      }
      
      return question;
    });
    
    return { questions, categories };
  } catch (error) {
    console.error("Error parsing question data:", error);
    return { questions: [], categories: new Set() };
  }
};

// Function to generate categories from parsed data
export const generateCategories = (categorySet: Set<string>): Category[] => {
  const colors = [
    "#FF0000", // YouTube
    "#8A2BE2", // Gry i Gaming
    "#1DB954", // Top roku
    "#FF4500", // Pytania Pułapki
    "#00BFFF", // Memy
    "#FFD700", // Wiedza Ogólna
  ];
  
  return Array.from(categorySet).map((name, index) => ({
    id: name,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    color: colors[index % colors.length]
  }));
};
