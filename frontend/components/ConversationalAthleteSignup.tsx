'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { Mail, Lock, User as UserIcon, MapPin, Calendar, Target, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface AthleteFormData {
  // Basic fields (steps 2-3)
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  
  // Athlete details (step 4)
  athleteName: string;
  dateOfBirth: string;
  position: string;
  skillLevel: string;
  
  // Training preferences (step 5)
  zipCode: string;
  trainingIntensity: string;
  preferredSchedule: string;
  sessionsPerWeek: number;
  sessionDuration: string;
  
  // Coach preferences (step 6)
  preferredCoachingStyle: string;
  preferredCommunicationStyle: string;
  preferGroupTraining: boolean;
  preferOneOnOne: boolean;
  
  // Goals & improvement (step 7)
  primaryGoals: string[];
  areasForImprovement: string[];
  specialNeeds: string;
  
  // Budget & logistics (step 8)
  maxBudgetPerSession: number;
  maxTravelDistanceMiles: number;
  willingToTravel: boolean;
}

interface ConversationalAthleteSignupProps {
  onSuccess: (email: string) => void;
}

export default function ConversationalAthleteSignup({ onSuccess }: ConversationalAthleteSignupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AthleteFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    athleteName: '',
    dateOfBirth: '',
    position: '',
    skillLevel: '',
    zipCode: '',
    trainingIntensity: '',
    preferredSchedule: '',
    sessionsPerWeek: 0,
    sessionDuration: '',
    preferredCoachingStyle: '',
    preferredCommunicationStyle: '',
    preferGroupTraining: false,
    preferOneOnOne: true,
    primaryGoals: [],
    areasForImprovement: [],
    specialNeeds: '',
    maxBudgetPerSession: 0,
    maxTravelDistanceMiles: 0,
    willingToTravel: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  
  const { registerUser } = useAuth();

  const totalSteps = 8;

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('athleteSignupDraft');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('athleteSignupDraft', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sessionsPerWeek' || name === 'maxBudgetPerSession' || name === 'maxTravelDistanceMiles'
              ? (value === '' ? 0 : parseFloat(value) || 0) 
              : value
    }));
    setError('');
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    setError('');
  };

  const handleArrayItemAdd = (name: keyof AthleteFormData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [name]: [...(prev[name] as string[]), value.trim()]
      }));
    }
  };

  const handleArrayItemRemove = (name: keyof AthleteFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: (prev[name] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    setDirection('forward');
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setDirection('backward');
    setStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step < totalSteps) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };

  const validateStep = (): boolean => {
    setError('');
    
    switch (step) {
      case 2:
        if (!formData.firstName.trim()) {
          setError('Please tell us your first name');
          return false;
        }
        if (!formData.lastName.trim()) {
          setError('Please tell us your last name');
          return false;
        }
        break;
      case 3:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim() || !emailRegex.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters long');
          return false;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
      case 4:
        if (!formData.athleteName.trim()) {
          setError('Please enter the athlete\'s name');
          return false;
        }
        if (!formData.dateOfBirth) {
          setError('Please select the athlete\'s date of birth');
          return false;
        }
        if (!formData.position) {
          setError('Please select a position');
          return false;
        }
        if (!formData.skillLevel) {
          setError('Please select a skill level');
          return false;
        }
        break;
      case 5:
        if (!formData.zipCode.trim()) {
          setError('Please enter your zip code');
          return false;
        }
        break;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setError('');
    setLoading(true);

    try {
      await registerUser({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        athleteName: formData.athleteName,
        dateOfBirth: formData.dateOfBirth,
        position: formData.position,
        skillLevel: formData.skillLevel,
        zipCode: formData.zipCode,
        trainingIntensity: formData.trainingIntensity,
        preferredSchedule: formData.preferredSchedule,
        sessionsPerWeek: formData.sessionsPerWeek,
        sessionDuration: formData.sessionDuration,
        preferredCoachingStyle: formData.preferredCoachingStyle,
        preferredCommunicationStyle: formData.preferredCommunicationStyle,
        preferGroupTraining: formData.preferGroupTraining,
        preferOneOnOne: formData.preferOneOnOne,
        willingToTravel: formData.willingToTravel,
        primaryGoals: formData.primaryGoals,
        areasForImprovement: formData.areasForImprovement,
        specialNeeds: formData.specialNeeds,
        maxBudgetPerSession: formData.maxBudgetPerSession,
        maxTravelDistanceMiles: formData.maxTravelDistanceMiles,
      });
      localStorage.removeItem('athleteSignupDraft');
      onSuccess(formData.email);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    const footballPositions = [
      'Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 
      'Offensive Line', 'Defensive Line', 'Linebacker', 
      'Cornerback', 'Safety', 'Kicker', 'Punter'
    ];

    const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
    
    const coachingStyles = ['Encouraging', 'Disciplined', 'Technical', 'Motivational', 'Holistic'];
    const communicationStyles = ['Direct', 'Supportive', 'Analytical', 'Collaborative'];
    const trainingIntensities = ['Light', 'Moderate', 'Intense', 'Very Intense'];
    const schedules = ['Mornings', 'Afternoons', 'Evenings', 'Weekends', 'Flexible'];
    const durations = ['30 minutes', '1 hour', '1.5 hours', '2 hours'];

    const goalSuggestions = ['Speed & Agility', 'Technique', 'Strength', 'Game IQ', 'Leadership'];
    const improvementSuggestions = ['Route Running', 'Footwork', 'Blocking', 'Tackling', 'Coverage'];

    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#274abb] to-[#1e3a8f] rounded-full flex items-center justify-center mb-6">
              <Target size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Find Your Perfect Coach! 🎯
            </h2>
            <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              We&apos;ll match you with coaches who fit your goals, style, and schedule. Let&apos;s get started!
            </p>
            <p className="text-gray-500">
              This will only take 3-4 minutes
            </p>
            <div className="pt-4">
              <Button
                onClick={handleNext}
                size="lg"
                icon={<ArrowRight size={20} />}
                className="min-w-[200px]"
              >
                Let&apos;s Get Started
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                First, what&apos;s your name?
              </h2>
              <p className="text-gray-600">
                This is how we&apos;ll address you (parent/guardian name).
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<UserIcon size={18} />}
                placeholder="John"
                required
                autoFocus
              />

              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<UserIcon size={18} />}
                placeholder="Smith"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Great to meet you, {formData.firstName}!
              </h2>
              <p className="text-gray-600">
                Now, let&apos;s set up your account credentials.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<Mail size={18} />}
                placeholder="you@example.com"
                helperText="We'll send a verification link here"
                required
                autoFocus
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<Lock size={18} />}
                helperText="At least 8 characters, one uppercase, one lowercase, one number, and one special character"
                required
                minLength={8}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<Lock size={18} />}
                helperText="Re-enter your password"
                required
                minLength={8}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Tell us about the athlete
              </h2>
              <p className="text-gray-600">
                Help us understand who we&apos;re helping to find the perfect coach.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <Input
                label="Athlete's Name"
                name="athleteName"
                type="text"
                value={formData.athleteName}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<UserIcon size={18} />}
                placeholder="e.g., John Smith Jr."
                required
                autoFocus
              />

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<Calendar size={18} />}
                required
              />

              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                  required
                  aria-required="true"
                  aria-label="Select football position"
                >
                  <option value="">Select position...</option>
                  {footballPositions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="skillLevel"
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                  required
                  aria-required="true"
                  aria-label="Select skill level"
                >
                  <option value="">Select skill level...</option>
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Training Preferences
              </h2>
              <p className="text-gray-600">
                Tell us about your training schedule and intensity preferences.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <Input
                label="Your Zip Code"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<MapPin size={18} />}
                placeholder="e.g., 90210"
                helperText="This helps us find local coaches"
                required
                autoFocus
              />

              <div>
                <label htmlFor="trainingIntensity" className="block text-sm font-medium text-gray-700 mb-2">
                  Training Intensity
                </label>
                <select
                  id="trainingIntensity"
                  name="trainingIntensity"
                  value={formData.trainingIntensity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                  aria-label="Select training intensity"
                >
                  <option value="">Select intensity...</option>
                  {trainingIntensities.map((intensity) => (
                    <option key={intensity} value={intensity}>{intensity}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="preferredSchedule" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Schedule
                </label>
                <select
                  id="preferredSchedule"
                  name="preferredSchedule"
                  value={formData.preferredSchedule}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                  aria-label="Select preferred schedule"
                >
                  <option value="">Select schedule...</option>
                  {schedules.map((schedule) => (
                    <option key={schedule} value={schedule}>{schedule}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Sessions Per Week"
                name="sessionsPerWeek"
                type="number"
                value={formData.sessionsPerWeek.toString()}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                min="0"
                placeholder="2"
              />

              <div>
                <label htmlFor="sessionDuration" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Session Duration
                </label>
                <select
                  id="sessionDuration"
                  name="sessionDuration"
                  value={formData.sessionDuration}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                  aria-label="Select preferred session duration"
                >
                  <option value="">Select duration...</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Coach Preferences
              </h2>
              <p className="text-gray-600">
                What coaching style works best for you?
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label htmlFor="preferredCoachingStyle" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Coaching Style
                </label>
                <select
                  id="preferredCoachingStyle"
                  name="preferredCoachingStyle"
                  value={formData.preferredCoachingStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                  aria-label="Select preferred coaching style"
                >
                  <option value="">Select style...</option>
                  {coachingStyles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="preferredCommunicationStyle" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Communication Style
                </label>
                <select
                  id="preferredCommunicationStyle"
                  name="preferredCommunicationStyle"
                  value={formData.preferredCommunicationStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                  aria-label="Select preferred communication style"
                >
                  <option value="">Select style...</option>
                  {communicationStyles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Format Preference
                </label>
                <div className="space-y-2">
                  <label htmlFor="preferOneOnOne" className="flex items-center space-x-2 cursor-pointer">
                    <input
                      id="preferOneOnOne"
                      type="checkbox"
                      name="preferOneOnOne"
                      checked={formData.preferOneOnOne}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                    />
                    <span className="text-sm text-gray-700">One-on-One Training</span>
                  </label>
                  <label htmlFor="preferGroupTraining" className="flex items-center space-x-2 cursor-pointer">
                    <input
                      id="preferGroupTraining"
                      type="checkbox"
                      name="preferGroupTraining"
                      checked={formData.preferGroupTraining}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                    />
                    <span className="text-sm text-gray-700">Group Training</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Goals & Areas for Improvement
              </h2>
              <p className="text-gray-600">
                What are the athlete&apos;s primary goals and areas to work on?
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Goals
                </label>
                <div className="space-y-2">
                  {formData.primaryGoals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={goal}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayItemRemove('primaryGoals', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newGoal"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="Add a goal..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newGoal') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleArrayItemAdd('primaryGoals', input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-[#f91942] text-white rounded-lg hover:bg-[#d01437] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Suggestions:</span>
                  {goalSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        if (!formData.primaryGoals.includes(suggestion)) {
                          handleArrayItemAdd('primaryGoals', suggestion);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas for Improvement
                </label>
                <div className="space-y-2">
                  {formData.areasForImprovement.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={area}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayItemRemove('areasForImprovement', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newArea"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="Add an area..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newArea') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleArrayItemAdd('areasForImprovement', input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-[#f91942] text-white rounded-lg hover:bg-[#d01437] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-500">Suggestions:</span>
                  {improvementSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        if (!formData.areasForImprovement.includes(suggestion)) {
                          handleArrayItemAdd('areasForImprovement', suggestion);
                        }
                      }}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Needs or Considerations (Optional)
                </label>
                <textarea
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent min-h-[80px]"
                  placeholder="Any special requirements or considerations coaches should know about..."
                />
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Budget & Logistics
              </h2>
              <p className="text-gray-600">
                Help us match you with coaches within your budget and location preferences.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <Input
                label="Max Budget Per Session ($)"
                name="maxBudgetPerSession"
                type="number"
                value={formData.maxBudgetPerSession.toString()}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                min="0"
                placeholder="100"
                helperText="Optional - helps narrow down options"
                autoFocus
              />

              <Input
                label="Max Travel Distance (miles)"
                name="maxTravelDistanceMiles"
                type="number"
                value={formData.maxTravelDistanceMiles.toString()}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                min="0"
                placeholder="25"
                helperText="How far are you willing to travel for sessions?"
              />

              <div>
                <label htmlFor="willingToTravel" className="flex items-center space-x-2 cursor-pointer">
                  <input
                    id="willingToTravel"
                    type="checkbox"
                    name="willingToTravel"
                    checked={formData.willingToTravel}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                  />
                  <span className="text-sm text-gray-700">
                    <strong>Willing to Travel</strong> - I can travel to coach&apos;s location
                  </span>
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  🎉 <strong>You&apos;re almost done!</strong> After registration, we&apos;ll match you with coaches who fit your preferences.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card padding="lg">
      {/* Progress Bar */}
      {step > 1 && (
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Step {step - 1} of {totalSteps - 1}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((step - 1) / (totalSteps - 1)) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#274abb] to-[#1e3a8f] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-shake">
          {error}
        </div>
      )}

      {/* Step Content with Animation */}
      <div 
        key={step}
        className={`animate-${direction === 'forward' ? 'fadeInUp' : 'fadeInDown'}`}
      >
        {getStepContent()}
      </div>

      {/* Navigation Buttons */}
      {step > 1 && (
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleBack}
            icon={<ArrowLeft size={20} />}
            disabled={loading}
          >
            Back
          </Button>
          
          <div className="flex-1" />
          
          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              icon={<ArrowRight size={20} />}
              size="lg"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              icon={<CheckCircle2 size={20} />}
              size="lg"
              isLoading={loading}
            >
              Create My Account
            </Button>
          )}
        </div>
      )}

      {/* Keyboard Hint */}
      {step > 1 && step < totalSteps && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">Enter</kbd> to continue
          </p>
        </div>
      )}
    </Card>
  );
}
