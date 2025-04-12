
import React from 'react';
import { Player } from '@/types';
import PlayerCard from './PlayerCard';

interface VideoGridProps {
  players: Player[];
  hostVideoUrl?: string;
  currentPlayerId?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ 
  players, 
  hostVideoUrl,
  currentPlayerId
}) => {
  const activePlayers = players.filter(
    p => p.status !== 'eliminated' || p.status === 'lucky-loser'
  );

  const getGridCols = () => {
    const count = activePlayers.length;
    if (count <= 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 6) return 'grid-cols-1 md:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-4';
  };

  return (
    <div className="space-y-4">
      {/* Host video (always on top, larger) */}
      {hostVideoUrl && (
        <div className="quiz-card p-4">
          <h3 className="text-lg font-bold mb-2">Prowadzący</h3>
          <div className="aspect-video w-full rounded overflow-hidden bg-black">
            <iframe 
              src={hostVideoUrl} 
              className="w-full h-full" 
              frameBorder="0" 
              allowFullScreen 
            />
          </div>
        </div>
      )}
      
      {/* Player videos grid */}
      <div className={`grid ${getGridCols()} gap-4`}>
        {activePlayers.map(player => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            isActive={player.id === currentPlayerId}
            showVideo={true}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;
