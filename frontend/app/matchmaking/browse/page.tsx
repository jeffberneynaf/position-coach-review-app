'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchmakingApi } from '@/lib/api';
import { Match, FindMatchesRequest } from '@/types/matchmaking';
import MatchCard from '@/components/matchmaking/MatchCard';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function BrowseMatches() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FindMatchesRequest>({
    pageNumber: 1,
    pageSize: 20,
    minMatchScore: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchMatches();
    }
  }, [filters, user, authLoading, router]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await matchmakingApi.findMatches(filters);
      setMatches(response.data.matches);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleInteract = async (matchId: number, actionType: string) => {
    try {
      await matchmakingApi.interactWithMatch(matchId, { actionType });
      // Refresh matches
      fetchMatches();
    } catch (err: any) {
      console.error('Failed to interact with match:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Coaches
          </h1>
          <p className="text-gray-600">
            Discover coaches that match your profile and preferences
          </p>
        </div>

        {/* Filters Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          
          <div className="text-sm text-gray-600">
            {matches.length} matches found
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  value={filters.position || ''}
                  onChange={(e) => setFilters({ ...filters, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g. Quarterback"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price per Session ($)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Match Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minMatchScore || 0}
                  onChange={(e) => setFilters({ ...filters, minMatchScore: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.offersVirtual || false}
                    onChange={(e) => setFilters({ ...filters, offersVirtual: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Virtual Sessions</span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.offersInPerson || false}
                    onChange={(e) => setFilters({ ...filters, offersInPerson: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">In-Person Sessions</span>
                </label>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={fetchMatches}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Search className="w-4 h-4 inline mr-2" />
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setFilters({
                    pageNumber: 1,
                    pageSize: 20,
                    minMatchScore: 0,
                  });
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p className="mt-4 text-gray-600">Finding your matches...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchMatches}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Matches Grid */}
        {!loading && !error && (
          <>
            {matches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 mb-4">
                  No matches found. Try adjusting your filters or creating your athlete profile.
                </p>
                <button
                  onClick={() => router.push('/matchmaking/athlete-profile')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Athlete Profile
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onInteract={handleInteract}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
