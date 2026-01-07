'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchmakingApi } from '@/lib/api';
import { Match } from '@/types/matchmaking';
import MatchCard from '@/components/matchmaking/MatchCard';
import { Heart, CheckCircle, List } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function MatchesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchMatches();
    }
  }, [activeTab, user, authLoading, router]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const response = await matchmakingApi.getMatches(status);
      setMatches(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleInteract = async (matchId: number, actionType: string) => {
    try {
      await matchmakingApi.interactWithMatch(matchId, { actionType });
      fetchMatches();
    } catch (err: any) {
      console.error('Failed to interact with match:', err);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Matches', icon: <List className="w-4 h-4" /> },
    { id: 'Suggested', label: 'Suggested', icon: <Heart className="w-4 h-4" /> },
    { id: 'AthleteInterested', label: 'Interested', icon: <Heart className="w-4 h-4" /> },
    { id: 'Connected', label: 'Connected', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const getFilteredMatches = () => {
    if (activeTab === 'all') return matches;
    return matches.filter(m => m.status === activeTab);
  };

  const filteredMatches = getFilteredMatches();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Matches
          </h1>
          <p className="text-gray-600">
            View and manage all your coach matches
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p className="mt-4 text-gray-600">Loading matches...</p>
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
            {filteredMatches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 mb-4">
                  No matches found in this category.
                </p>
                <button
                  onClick={() => router.push('/matchmaking/browse')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Browse Coaches
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match) => (
                  <div
                    key={match.id}
                    onClick={() => router.push(`/matchmaking/match/${match.id}`)}
                    className="cursor-pointer"
                  >
                    <MatchCard
                      match={match}
                      onInteract={handleInteract}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
