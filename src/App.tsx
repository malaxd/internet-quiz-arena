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

const App = () => {
  const [timer, setTimer] = useState(30); // Initial timer value (30 seconds)
  const [isRunning, setIsRunning] = useState(false);

  // Start the timer
  const startTimer = () => {
    setIsRunning(true);
  };

  // Stop the timer
  const stopTimer = () => {
    setIsRunning(false);
  };

  // Reset the timer
  const resetTimer = () => {
    setTimer(30);
    setIsRunning(false);
  };

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      if (timer <= 0) {
        clearInterval(interval);
        setIsRunning(false);
      }

      return () => clearInterval(interval);
    }
  }, [isRunning, timer]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/host" element={<HostPanel />} />
            <Route path="/public" element={<PublicPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <div className="timer-container">
          <h2>Panel Prowadzącego</h2>
          <p>Czas: {timer}s</p>
          <div>
            <button onClick={startTimer} disabled={isRunning}>Start Timer</button>
            <button onClick={stopTimer} disabled={!isRunning}>Stop Timer</button>
            <button onClick={resetTimer}>Reset Timer</button>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
