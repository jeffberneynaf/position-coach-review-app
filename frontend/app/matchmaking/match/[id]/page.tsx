'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { matchmakingApi } from '@/lib/api';
import { Match } from '@/types/matchmaking';
import MatchScoreBreakdownComponent from '@/components/matchmaking/MatchScoreBreakdown';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Heart, X } from 'lucide-react';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = parseInt(params.id as string);
  
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMatch();
  }, [matchId]);

  const fetchMatch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await matchmakingApi.getMatch(matchId);
      setMatch(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  const handleInteract = async (actionType: string) => {
    try {
      await matchmakingApi.interactWithMatch(matchId, { actionType });
      fetchMatch();
    } catch (err: any) {
      console.error('Failed to interact with match:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading match details...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-700">{error || 'Match not found'}</p>
          <button
            onClick={() => router.push('/matchmaking/matches')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  const coach = match.coachMatchProfile!;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/matchmaking/matches')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Matches
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coach Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {coach.coachFirstName} {coach.coachLastName}
                  </h1>
                  <p className="text-lg text-gray-600">{coach.coachingStyle} Coach</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(match.matchScore)}%
                  </div>
                  <p className="text-sm text-gray-600">Match Score</p>
                </div>
              </div>

              {/* Contact Info */}
              {match.status === 'Connected' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-green-800">
                      <Mail className="w-4 h-4 mr-2" />
                      <a href={`mailto:${coach.coachEmail}`} className="hover:underline">
                        {coach.coachEmail}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Why This Match */}
              {match.matchReasons && match.matchReasons.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Why This Match Works
                  </h3>
                  <ul className="space-y-2">
                    {match.matchReasons.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Training Philosophy */}
              {coach.trainingPhilosophy && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Training Philosophy
                  </h3>
                  <p className="text-gray-700">{coach.trainingPhilosophy}</p>
                </div>
              )}

              {/* Specialties */}
              {coach.specialties && coach.specialties.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coach.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {coach.certifications && coach.certifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Certifications
                  </h3>
                  <ul className="space-y-1">
                    {coach.certifications.map((cert, index) => (
                      <li key={index} className="text-gray-700">• {cert}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success Stories */}
              {coach.successStories && coach.successStories.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Success Stories
                  </h3>
                  <div className="space-y-3">
                    {coach.successStories.map((story, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{story}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactions Timeline */}
            {match.interactions && match.interactions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Interaction History
                </h3>
                <div className="space-y-3">
                  {match.interactions.map((interaction) => (
                    <div key={interaction.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {interaction.actorType}
                          </span>
                          <span className="text-sm text-gray-600">
                            {interaction.actionType}
                          </span>
                        </div>
                        {interaction.message && (
                          <p className="text-sm text-gray-700">{interaction.message}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(interaction.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Breakdown */}
            {match.scoreBreakdown && (
              <MatchScoreBreakdownComponent breakdown={match.scoreBreakdown} />
            )}

            {/* Quick Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Session Price</p>
                  <p className="font-medium text-gray-900">
                    ${coach.sessionPriceMin} - ${coach.sessionPriceMax}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium text-gray-900">
                    {coach.yearsCoachingPosition} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Days</p>
                  <p className="font-medium text-gray-900">
                    {coach.availableDays.join(', ') || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Training Options</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {coach.acceptsOneOnOne && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        1-on-1
                      </span>
                    )}
                    {coach.acceptsGroupTraining && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        Group
                      </span>
                    )}
                    {coach.offersVirtualSessions && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        Virtual
                      </span>
                    )}
                    {coach.offersInPersonSessions && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        In-Person
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {match.status === 'Suggested' && (
              <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
                <button
                  onClick={() => handleInteract('interested')}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Express Interest
                </button>
                <button
                  onClick={() => handleInteract('pass')}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Pass
                </button>
              </div>
            )}

            {match.status === 'Connected' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-2">
                  🎉 You're Connected!
                </h3>
                <p className="text-green-800 text-sm">
                  You can now reach out to {coach.coachFirstName} directly using the contact information provided.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
