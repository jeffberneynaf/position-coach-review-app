'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchmakingApi } from '@/lib/api';
import { Match } from '@/types/matchmaking';
import { Heart, X, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DiscoverPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      fetchMatches();
    }
  }, [user, authLoading, router]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await matchmakingApi.findMatches({
        pageNumber: 1,
        pageSize: 20,
        minMatchScore: 50,
      });
      setMatches(response.data.matches.filter(m => m.status === 'Suggested'));
      setCurrentIndex(0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (currentIndex >= matches.length) return;

    const currentMatch = matches[currentIndex];
    
    try {
      const actionType = action === 'like' ? 'interested' : 'pass';
      await matchmakingApi.interactWithMatch(currentMatch.id, { actionType });
      
      // Move to next card
      setCurrentIndex(currentIndex + 1);
    } catch (err: any) {
      console.error('Failed to interact with match:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchMatches}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= matches.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No More Matches
          </h2>
          <p className="text-gray-600 mb-6">
            You've seen all available matches. Check back later for new coaches!
          </p>
          <button
            onClick={() => router.push('/matchmaking/matches')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Your Matches
          </button>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentIndex];
  const coach = currentMatch.coachMatchProfile;

  if (!coach) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Coaches
          </h1>
          <p className="text-gray-600">
            {matches.length - currentIndex} matches remaining
          </p>
        </div>

        {/* Match Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Score Badge */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {coach.coachFirstName} {coach.coachLastName}
                </h2>
                <p className="text-blue-100">{coach.coachingStyle}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{Math.round(currentMatch.matchScore)}%</div>
                <p className="text-sm text-blue-100">Match</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Match Reasons */}
            {currentMatch.matchReasons && currentMatch.matchReasons.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-blue-600" />
                  Why This Match Works
                </h3>
                <ul className="space-y-1">
                  {currentMatch.matchReasons.map((reason, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ${coach.sessionPriceMin}-${coach.sessionPriceMax}
                </p>
                <p className="text-xs text-gray-600">Per Session</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {coach.yearsCoachingPosition}
                </p>
                <p className="text-xs text-gray-600">Years Experience</p>
              </div>
            </div>

            {/* Training Options */}
            <div className="flex flex-wrap gap-2 py-4 border-t border-gray-200">
              {coach.acceptsOneOnOne && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  1-on-1
                </span>
              )}
              {coach.acceptsGroupTraining && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Group
                </span>
              )}
              {coach.offersVirtualSessions && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Virtual
                </span>
              )}
              {coach.offersInPersonSessions && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  In-Person
                </span>
              )}
            </div>

            {/* Specialties */}
            {coach.specialties && coach.specialties.length > 0 && (
              <div className="py-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {coach.specialties.slice(0, 4).map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Days */}
            {coach.availableDays && coach.availableDays.length > 0 && (
              <div className="py-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Available Days</h3>
                <p className="text-sm text-gray-700">
                  {coach.availableDays.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6 justify-center">
          <button
            onClick={() => handleSwipe('pass')}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          
          <button
            onClick={() => handleSwipe('like')}
            className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center hover:from-pink-600 hover:to-red-600 transition-colors"
          >
            <Heart className="w-10 h-10 text-white" fill="white" />
          </button>
        </div>

        {/* View Details Link */}
        <div className="text-center mt-4">
          <a
            href={`/matchmaking/match/${currentMatch.id}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View Full Profile
          </a>
        </div>
      </div>
    </div>
  );
}
