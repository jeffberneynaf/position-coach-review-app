import { MatchScoreBreakdown } from '@/types/matchmaking';

interface MatchScoreBreakdownComponentProps {
  breakdown: MatchScoreBreakdown;
}

export default function MatchScoreBreakdownComponent({ breakdown }: MatchScoreBreakdownComponentProps) {
  const components = [
    { name: 'Location', score: breakdown.locationScore, max: 20, color: 'bg-blue-500' },
    { name: 'Specialization', score: breakdown.specializationScore, max: 20, color: 'bg-green-500' },
    { name: 'Coaching Style', score: breakdown.coachingStyleScore, max: 15, color: 'bg-purple-500' },
    { name: 'Schedule', score: breakdown.scheduleScore, max: 15, color: 'bg-yellow-500' },
    { name: 'Skill Level', score: breakdown.skillLevelScore, max: 10, color: 'bg-pink-500' },
    { name: 'Budget', score: breakdown.budgetScore, max: 10, color: 'bg-indigo-500' },
    { name: 'Training Format', score: breakdown.trainingFormatScore, max: 5, color: 'bg-red-500' },
    { name: 'Communication', score: breakdown.communicationScore, max: 5, color: 'bg-teal-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Score Breakdown</h3>
      
      <div className="space-y-4">
        {components.map((component) => {
          const percentage = (component.score / component.max) * 100;
          
          return (
            <div key={component.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{component.name}</span>
                <span className="text-sm text-gray-600">
                  {component.score.toFixed(1)} / {component.max}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${component.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total Score</span>
          <span className="text-2xl font-bold text-blue-600">
            {Math.round(breakdown.totalScore)}%
          </span>
        </div>
      </div>
    </div>
  );
}
