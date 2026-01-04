

import { useState, useEffect } from 'react';
import { AlertCircle, Heart, Filter, Search, User, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {type Game } from '../types';
import { API_ENDPOINTS } from '../config/api';
import { GameCard } from '../components/GameCard';

export const GamesPage = () => {
  const { user, logout } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    fetchGames();
  }, [showFavoritesOnly]);

  const fetchGames = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (showFavoritesOnly) {
        params.append('favorites', 'true');
      }

      const response = await fetch(`${API_ENDPOINTS.GAMES}?${params}`, {
        credentials: 'include', // Important: Send cookies
      });

      if (!response.ok) throw new Error('Failed to fetch games');

      const result = await response.json();
      setGames(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (gameId: number) => {
    const game = games.find((g) => g.id === gameId);
    const isFavorite = game?.isFavorite;

    try {
      const response = await fetch(`${API_ENDPOINTS.FAVORITES}/${gameId}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Update local state
        setGames(games.map((g) =>
          g.id === gameId ? { ...g, isFavorite: !isFavorite } : g
        ));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const getFilters = () => {
    const filters = new Set<string>();
    games.forEach((game) => {
      if (game.provider) filters.add(game.provider);
      if (game.category) filters.add(game.category);
    });
    return Array.from(filters);
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      searchQuery === '' ||
      game.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === 'all' ||
      game.provider === selectedFilter ||
      game.category === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sports & Casino Platform</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User size={20} />
                <span className="font-medium">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search games, providers, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="all">All Categories</option>
                {getFilters().map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-4 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                  showFavoritesOnly
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={18} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
                Favorites
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-purple-600" size={40} />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Games</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchGames}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredGames.length === 0 && (
          <div className="text-center py-20">
            <Filter className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No games found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}

        {!loading && !error && filteredGames.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};