import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HostPanel from "./components/HostPanel";
import PublicPanel from "./components/PublicPanel";

// Create a client for react-query
const queryClient = new QueryClient();

// HostPanel Component (dodajemy timer)
const HostPanel = () => {
  const [timer, setTimer] = useState(30); // Domyślny czas - 30 sekund
  const [isRunning, setIsRunning] = useState(false); // Flaga, czy timer jest uruchomiony
  const [inputTime, setInputTime] = useState(30); // Czas wprowadzany przez użytkownika

  const startTimer = () => {
    setTimer(inputTime); // Rozpoczynamy od wprowadzonego czasu
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimer(inputTime); // Resetujemy timer do początkowego czasu
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) return; // Jeśli timer nie jest aktywny, nic nie rób
    if (timer === 0) {
      setIsRunning(false); // Zatrzymaj timer, jeśli czas minął
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1); // Zmniejszamy czas co sekundę
    }, 1000); // Co 1 sekundę

    return () => clearInterval(interval); // Posprzątanie po timerze
  }, [isRunning, timer]); // Używamy timeru i flagi isRunning

  return (
    <div>
      <h1>Panel Prowadzącego</h1>
      <div>
        <h2>Czas: {timer}s</h2>
        {/* Pole do ustawienia czasu */}
        <input 
          type="number" 
          value={inputTime}
          onChange={(e) => setInputTime(parseInt(e.target.value, 10))}
          min="0"
          className="border p-2 mb-4"
        />
        <button onClick={startTimer} className="bg-blue-500 text-white p-2 mr-2">Start Timer</button>
        <button onClick={stopTimer} className="bg-red-500 text-white p-2 mr-2">Stop Timer</button>
        <button onClick={resetTimer} className="bg-yellow-500 text-white p-2">Reset Timer</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <main> {/* Dodanie elementu main */}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/host" element={<HostPanel />} />
              <Route path="/public" element={<PublicPanel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main> {/* Koniec elementu main */}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
