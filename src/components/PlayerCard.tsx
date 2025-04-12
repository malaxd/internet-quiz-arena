
import React from 'react';
import { Player } from '@/types';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: Player;
  isActive?: boolean;
  isCompact?: boolean;
  showVideo?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  isActive = false, 
  isCompact = false,
  showVideo = false 
}) => {
  const lifePercentage = Math.max(0, player.life);
  
  const getLifeBarColor = () => {
    if (lifePercentage > 66) return 'bg-quiz-success';
    if (lifePercentage > 33) return 'bg-quiz-warning';
    return 'bg-quiz-danger';
  };

  const getStatusBadge = () => {
    switch (player.status) {
      case 'eliminated':
        return <span className="absolute top-2 right-2 bg-quiz-danger text-white text-xs py-1 px-2 rounded">Wyeliminowany</span>;
      case 'lucky-loser':
        return <span className="absolute top-2 right-2 bg-quiz-warning text-white text-xs py-1 px-2 rounded">Lucky Loser</span>;
      case 'winner':
        return <span className="absolute top-2 right-2 bg-quiz-success text-white text-xs py-1 px-2 rounded">Zwycięzca</span>;
      default:
        return null;
    }
  };

  return (
    <div 
      className={cn(
        "quiz-card relative overflow-hidden transition-all duration-300",
        isActive && "neon-border animate-pulse-slow",
        isCompact ? "p-2" : "p-4",
        player.status === 'eliminated' && "opacity-60"
      )}
    >
      {getStatusBadge()}
      
      <div className="flex items-center gap-3">
        {showVideo && player.videoUrl ? (
          <div className="relative aspect-video w-full mb-2 rounded overflow-hidden bg-black">
            <iframe 
              src={player.videoUrl} 
              className="w-full h-full" 
              frameBorder="0" 
              allowFullScreen 
            />
          </div>
        ) : (
          !isCompact && (
            <div className="w-12 h-12 rounded-full bg-quiz-primary flex items-center justify-center text-xl font-bold">
              {player.name.charAt(0)}
            </div>
          )
        )}
        
        <div className="flex-1">
          <h3 className={cn(
            "font-bold",
            isCompact ? "text-sm" : "text-lg"
          )}>
            {player.name}
          </h3>
          
          {!isCompact && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm">Punkty: {player.points}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs">Życie</span>
          <span className="text-xs font-medium">{lifePercentage}%</span>
        </div>
        <div className="h-2 bg-quiz-card rounded overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-500", getLifeBarColor())}
            style={{ width: `${lifePercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
