import { Match, CoachMatchProfile } from '@/types/matchmaking';
import { MapPin, DollarSign, Clock, Award, Heart } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  onInteract?: (matchId: number, actionType: string) => void;
  compact?: boolean;
}

export default function MatchCard({ match, onInteract, compact = false }: MatchCardProps) {
  const coach = match.coachMatchProfile;
  
  if (!coach) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      'Suggested': { color: 'bg-gray-100 text-gray-800', text: 'Suggested' },
      'AthleteInterested': { color: 'bg-blue-100 text-blue-800', text: 'You Liked' },
      'CoachInterested': { color: 'bg-purple-100 text-purple-800', text: 'Coach Liked' },
      'Connected': { color: 'bg-green-100 text-green-800', text: 'Connected' },
      'Dismissed': { color: 'bg-red-100 text-red-800', text: 'Dismissed' },
    };
    
    const badge = badges[status] || badges['Suggested'];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      {/* Header with Score and Status */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {coach.coachFirstName} {coach.coachLastName}
          </h3>
          <p className="text-sm text-gray-500">{coach.coachingStyle}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${getScoreColor(match.matchScore)}`}>
            {Math.round(match.matchScore)}%
          </div>
          {getStatusBadge(match.status)}
        </div>
      </div>

      {/* Match Reasons */}
      {!compact && match.matchReasons && match.matchReasons.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Why this match:</p>
          <ul className="space-y-1">
            {match.matchReasons.slice(0, 3).map((reason, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-2" />
          ${coach.sessionPrice}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Award className="w-4 h-4 mr-2" />
          {coach.yearsCoachingPosition} years exp
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2" />
          {coach.offersVirtualSessions ? 'Virtual' : 'In-person'}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          {coach.availableDays.slice(0, 2).join(', ')}
        </div>
      </div>

      {/* Specialties */}
      {coach.specialties && coach.specialties.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {coach.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {onInteract && match.status === 'Suggested' && (
        <div className="flex gap-3">
          <button
            onClick={() => onInteract(match.id, 'interested')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Interested
          </button>
          <button
            onClick={() => onInteract(match.id, 'pass')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Pass
          </button>
        </div>
      )}
      
      {match.status === 'Connected' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-green-800 font-medium">
            🎉 You're connected! Reach out to {coach.coachFirstName} at {coach.coachEmail}
          </p>
        </div>
      )}
    </div>
  );
}
