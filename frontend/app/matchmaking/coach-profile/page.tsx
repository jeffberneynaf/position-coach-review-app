'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { matchmakingApi } from '@/lib/api';
import { CreateCoachMatchProfileRequest, CoachMatchProfile } from '@/types/matchmaking';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';

export default function CoachProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingProfile, setExistingProfile] = useState<CoachMatchProfile | null>(null);
  const [formData, setFormData] = useState<CreateCoachMatchProfileRequest>({
    coachingStyle: '',
    communicationStyle: '',
    trainingPhilosophy: '',
    specialties: [],
    positionsCoached: '',
    skillLevelsAccepted: '',
    acceptsGroupTraining: false,
    acceptsOneOnOne: true,
    availableDays: [],
    availableTimeSlots: [],
    maxNewClientsPerMonth: 5,
    sessionPriceMin: 50,
    sessionPriceMax: 150,
    travelRadiusMiles: 25,
    offersVirtualSessions: false,
    offersInPersonSessions: true,
    successStories: [],
    yearsCoachingPosition: 0,
    certifications: [],
    preferredAthleteTraits: [],
    minAgeAccepted: 12,
    maxAgeAccepted: 25,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await matchmakingApi.getCoachMatchProfile();
        setExistingProfile(response.data);
        setFormData({
          coachingStyle: response.data.coachingStyle,
          communicationStyle: response.data.communicationStyle,
          trainingPhilosophy: response.data.trainingPhilosophy,
          specialties: response.data.specialties,
          positionsCoached: response.data.positionsCoached,
          skillLevelsAccepted: response.data.skillLevelsAccepted,
          acceptsGroupTraining: response.data.acceptsGroupTraining,
          acceptsOneOnOne: response.data.acceptsOneOnOne,
          availableDays: response.data.availableDays,
          availableTimeSlots: response.data.availableTimeSlots,
          maxNewClientsPerMonth: response.data.maxNewClientsPerMonth,
          sessionPriceMin: response.data.sessionPriceMin,
          sessionPriceMax: response.data.sessionPriceMax,
          travelRadiusMiles: response.data.travelRadiusMiles,
          offersVirtualSessions: response.data.offersVirtualSessions,
          offersInPersonSessions: response.data.offersInPersonSessions,
          successStories: response.data.successStories,
          yearsCoachingPosition: response.data.yearsCoachingPosition,
          certifications: response.data.certifications,
          preferredAthleteTraits: response.data.preferredAthleteTraits,
          minAgeAccepted: response.data.minAgeAccepted,
          maxAgeAccepted: response.data.maxAgeAccepted,
        });
      } catch (err) {
        // No profile exists yet
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (existingProfile) {
        await matchmakingApi.updateCoachMatchProfile(formData);
      } else {
        await matchmakingApi.createCoachMatchProfile(formData);
      }
      router.push('/matchmaking/matches');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const coachingStyles = ['Motivational', 'Technical', 'Holistic', 'Disciplined', 'Supportive'];
  const communicationStyles = ['Direct', 'Supportive', 'Detailed', 'Casual', 'Formal'];
  const positions = ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line', 'Defensive Line', 'Linebacker', 'Cornerback', 'Safety', 'Kicker', 'Punter'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const specialtyOptions = ['Speed & Agility', 'Strength Training', 'Technique Refinement', 'Game Strategy', 'Mental Toughness', 'Injury Prevention', 'College Prep', 'Pro Prep'];

  const toggleDay = (day: string) => {
    if (formData.availableDays.includes(day)) {
      setFormData({
        ...formData,
        availableDays: formData.availableDays.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        availableDays: [...formData.availableDays, day]
      });
    }
  };

  const toggleSpecialty = (specialty: string) => {
    if (formData.specialties.includes(specialty)) {
      setFormData({
        ...formData,
        specialties: formData.specialties.filter(s => s !== specialty)
      });
    } else {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialty]
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Coaching Style & Philosophy</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coaching Style
              </label>
              <select
                value={formData.coachingStyle}
                onChange={(e) => setFormData({ ...formData, coachingStyle: e.target.value })}
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
                Communication Style
              </label>
              <select
                value={formData.communicationStyle}
                onChange={(e) => setFormData({ ...formData, communicationStyle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select style</option>
                {communicationStyles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Philosophy
              </label>
              <textarea
                value={formData.trainingPhilosophy}
                onChange={(e) => setFormData({ ...formData, trainingPhilosophy: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Describe your approach to coaching and training..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years Coaching This Position
              </label>
              <input
                type="number"
                min="0"
                value={formData.yearsCoachingPosition}
                onChange={(e) => setFormData({ ...formData, yearsCoachingPosition: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Expertise & Specialties</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Positions Coached
              </label>
              <input
                type="text"
                value={formData.positionsCoached}
                onChange={(e) => setFormData({ ...formData, positionsCoached: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Quarterback, Running Back"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Levels Accepted
              </label>
              <input
                type="text"
                value={formData.skillLevelsAccepted}
                onChange={(e) => setFormData({ ...formData, skillLevelsAccepted: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Beginner, Intermediate, Advanced, All Levels"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {specialtyOptions.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleSpecialty(specialty)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.specialties.includes(specialty)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Min Age</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minAgeAccepted}
                    onChange={(e) => setFormData({ ...formData, minAgeAccepted: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Max Age</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxAgeAccepted}
                    onChange={(e) => setFormData({ ...formData, maxAgeAccepted: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Availability & Pricing</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Days
              </label>
              <div className="grid grid-cols-2 gap-3">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      formData.availableDays.includes(day)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Price Range ($)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Min Price</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sessionPriceMin}
                    onChange={(e) => setFormData({ ...formData, sessionPriceMin: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Max Price</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sessionPriceMax}
                    onChange={(e) => setFormData({ ...formData, sessionPriceMax: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max New Clients Per Month
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxNewClientsPerMonth}
                onChange={(e) => setFormData({ ...formData, maxNewClientsPerMonth: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Radius (miles)
              </label>
              <input
                type="number"
                min="0"
                value={formData.travelRadiusMiles}
                onChange={(e) => setFormData({ ...formData, travelRadiusMiles: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Training Options</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Format
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.acceptsOneOnOne}
                    onChange={(e) => setFormData({ ...formData, acceptsOneOnOne: e.target.checked })}
                    className="mr-2"
                  />
                  <span>1-on-1 Training</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.acceptsGroupTraining}
                    onChange={(e) => setFormData({ ...formData, acceptsGroupTraining: e.target.checked })}
                    className="mr-2"
                  />
                  <span>Group Training</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.offersVirtualSessions}
                    onChange={(e) => setFormData({ ...formData, offersVirtualSessions: e.target.checked })}
                    className="mr-2"
                  />
                  <span>Virtual Sessions</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.offersInPersonSessions}
                    onChange={(e) => setFormData({ ...formData, offersInPersonSessions: e.target.checked })}
                    className="mr-2"
                  />
                  <span>In-Person Sessions</span>
                </label>
              </div>
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

          <form onSubmit={(e) => e.preventDefault()}>
            {renderStep()}

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
