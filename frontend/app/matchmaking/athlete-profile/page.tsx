'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchmakingApi } from '@/lib/api';
import { CreateAthleteProfileRequest, AthleteProfile } from '@/types/matchmaking';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

export default function AthleteProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingProfile, setExistingProfile] = useState<AthleteProfile | null>(null);
  const [formData, setFormData] = useState<CreateAthleteProfileRequest>({
    athleteName: '',
    dateOfBirth: '',
    position: '',
    skillLevel: '',
    zipCode: '',
    trainingIntensity: '',
    preferredSchedule: '',
    sessionsPerWeek: 2,
    sessionDuration: '60 minutes',
    preferredCoachingStyle: '',
    preferredCommunicationStyle: '',
    preferGroupTraining: false,
    preferOneOnOne: true,
    primaryGoals: [],
    areasForImprovement: [],
    specialNeeds: '',
    maxBudgetPerSession: 100,
    maxTravelDistanceMiles: 25,
    willingToTravel: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await matchmakingApi.getAthleteProfile();
        setExistingProfile(response.data);
        // Pre-fill form with existing data
        setFormData({
          athleteName: response.data.athleteName,
          dateOfBirth: response.data.dateOfBirth.substring(0, 10), // Extract YYYY-MM-DD
          position: response.data.position,
          skillLevel: response.data.skillLevel,
          zipCode: response.data.zipCode,
          trainingIntensity: response.data.trainingIntensity,
          preferredSchedule: response.data.preferredSchedule,
          sessionsPerWeek: response.data.sessionsPerWeek,
          sessionDuration: response.data.sessionDuration,
          preferredCoachingStyle: response.data.preferredCoachingStyle,
          preferredCommunicationStyle: response.data.preferredCommunicationStyle,
          preferGroupTraining: response.data.preferGroupTraining,
          preferOneOnOne: response.data.preferOneOnOne,
          primaryGoals: response.data.primaryGoals,
          areasForImprovement: response.data.areasForImprovement,
          specialNeeds: response.data.specialNeeds,
          maxBudgetPerSession: response.data.maxBudgetPerSession,
          maxTravelDistanceMiles: response.data.maxTravelDistanceMiles,
          willingToTravel: response.data.willingToTravel,
        });
      } catch (err) {
        // No profile exists yet, that's fine
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (existingProfile) {
        await matchmakingApi.updateAthleteProfile(formData);
      } else {
        await matchmakingApi.createAthleteProfile(formData);
      }
      router.push('/matchmaking/browse');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const positions = ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line', 'Defensive Line', 'Linebacker', 'Cornerback', 'Safety', 'Kicker', 'Punter'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
  const trainingIntensities = ['Light', 'Moderate', 'Intense', 'Very Intense'];
  const schedules = ['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekends', 'Flexible'];
  const coachingStyles = ['Motivational', 'Technical', 'Holistic', 'Disciplined', 'Supportive'];
  const communicationStyles = ['Direct', 'Supportive', 'Detailed', 'Casual', 'Formal'];
  const goalOptions = ['Speed & Agility', 'Strength Training', 'Technique Refinement', 'Game Strategy', 'Mental Toughness', 'Injury Prevention', 'College Prep', 'Pro Prep'];

  const toggleGoal = (goal: string) => {
    if (formData.primaryGoals.includes(goal)) {
      setFormData({
        ...formData,
        primaryGoals: formData.primaryGoals.filter(g => g !== goal)
      });
    } else {
      setFormData({
        ...formData,
        primaryGoals: [...formData.primaryGoals, goal]
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Athlete Name *
              </label>
              <input
                type="text"
                value={formData.athleteName}
                onChange={(e) => setFormData({ ...formData, athleteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter athlete name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select position</option>
                {positions.map((pos) => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level *
              </label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select skill level</option>
                {skillLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter zip code"
                maxLength={5}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Training Preferences</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Intensity
              </label>
              <select
                value={formData.trainingIntensity}
                onChange={(e) => setFormData({ ...formData, trainingIntensity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select intensity</option>
                {trainingIntensities.map((intensity) => (
                  <option key={intensity} value={intensity}>{intensity}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Schedule
              </label>
              <select
                value={formData.preferredSchedule}
                onChange={(e) => setFormData({ ...formData, preferredSchedule: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select schedule</option>
                {schedules.map((schedule) => (
                  <option key={schedule} value={schedule}>{schedule}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sessions Per Week
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={formData.sessionsPerWeek}
                onChange={(e) => setFormData({ ...formData, sessionsPerWeek: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferOneOnOne}
                    onChange={(e) => setFormData({ ...formData, preferOneOnOne: e.target.checked })}
                    className="mr-2"
                  />
                  <span>1-on-1 Training</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferGroupTraining}
                    onChange={(e) => setFormData({ ...formData, preferGroupTraining: e.target.checked })}
                    className="mr-2"
                  />
                  <span>Group Training</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Goals & Style</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Goals (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.primaryGoals.includes(goal)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Coaching Style
              </label>
              <select
                value={formData.preferredCoachingStyle}
                onChange={(e) => setFormData({ ...formData, preferredCoachingStyle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select style</option>
                {coachingStyles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Communication Style
              </label>
              <select
                value={formData.preferredCommunicationStyle}
                onChange={(e) => setFormData({ ...formData, preferredCommunicationStyle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select style</option>
                {communicationStyles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Budget & Location</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Budget Per Session ($)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={formData.maxBudgetPerSession}
                onChange={(e) => setFormData({ ...formData, maxBudgetPerSession: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Travel Distance (miles)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.maxTravelDistanceMiles}
                onChange={(e) => setFormData({ ...formData, maxTravelDistanceMiles: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.willingToTravel}
                  onChange={(e) => setFormData({ ...formData, willingToTravel: e.target.checked })}
                  className="mr-2"
                />
                <span>Willing to travel for training</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Needs or Accommodations
              </label>
              <textarea
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Any special requirements or accommodations needed..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 mx-1 rounded ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 text-center">
              Step {step} of 4
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Form Step */}
          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  {loading ? 'Saving...' : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {existingProfile ? 'Update Profile' : 'Create Profile'}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
