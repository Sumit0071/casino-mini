

import { Heart } from 'lucide-react';
import { type Game } from '../types';

interface GameCardProps {
  game: Game;
  onToggleFavorite: (gameId: number) => void;
}

export const GameCard = ({ game, onToggleFavorite }: GameCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-2">
            {game.category || 'Game'}
          </span>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{game.name}</h3>
          {game.provider && (
            <p className="text-sm text-gray-600">{game.provider}</p>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(game.id)}
          className={`p-2 rounded-full transition ${
            game.isFavorite
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <Heart size={20} fill={game.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};