
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-quiz-background bg-cyber-grid bg-[size:50px_50px] flex flex-col items-center justify-center p-4 text-white">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
          Internet Quiz Arena
        </h1>
        
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
          Interaktywna platforma teleturnieju na żywo dla prowadzących
          i uczestników streamów.
        </p>
        
        <div className="quiz-card p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-6">Wybierz panel:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="aspect-video bg-quiz-primary/50 flex items-center justify-center rounded-lg overflow-hidden border border-quiz-primary">
                <span className="text-2xl font-bold">👑</span>
              </div>
              <h3 className="text-xl font-bold">Panel Prowadzącego</h3>
              <p className="text-sm text-gray-300 mb-4">
                Kontroluj całą rozgrywkę, zadawaj pytania i zarządzaj uczestnikami.
              </p>
              <Link to="/host">
                <Button className="w-full quiz-button">
                  Panel Prowadzącego
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="aspect-video bg-quiz-primary/50 flex items-center justify-center rounded-lg overflow-hidden border border-quiz-primary">
                <span className="text-2xl font-bold">👥</span>
              </div>
              <h3 className="text-xl font-bold">Panel Publiczny</h3>
              <p className="text-sm text-gray-300 mb-4">
                Śledź przebieg teleturnieju jako uczestnik lub widz z Twitcha.
              </p>
              <Link to="/public">
                <Button className="w-full quiz-button-secondary">
                  Panel Publiczny
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-gray-400 text-sm">
        <p>© 2025 Internet Quiz Arena. Wszelkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
};

export default Index;
