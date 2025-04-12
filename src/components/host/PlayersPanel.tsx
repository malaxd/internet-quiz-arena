
import React from 'react';
import { Player } from '@/types';
import PlayerCard from '../PlayerCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlayersPanelProps {
  players: Player[];
  currentPlayerId?: string;
}

const PlayersPanel: React.FC<PlayersPanelProps> = ({
  players,
  currentPlayerId
}) => {
  const activePlayers = players.filter(p => p.status !== 'eliminated');

  return (
    <div className="quiz-card p-4">
      <h2 className="text-xl font-bold mb-4">
        Gracze <span className="text-sm text-gray-400">({activePlayers.length} aktywnych)</span>
      </h2>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Aktywni</TabsTrigger>
          <TabsTrigger value="all">Wszyscy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activePlayers.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                isActive={player.id === currentPlayerId}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {players.map(player => (
              <PlayerCard 
                key={player.id} 
                player={player} 
                isActive={player.id === currentPlayerId}
                isCompact={true}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlayersPanel;
