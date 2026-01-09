'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import ImageUpload from '@/components/ImageUpload';
import { uploadCoachPhoto } from '@/lib/api';
import { Mail, Lock, User as UserIcon, MapPin, Phone, Briefcase, FileText, CheckCircle2, ArrowRight, ArrowLeft, Camera } from 'lucide-react';

interface CoachFormData {
  // Basic fields (steps 1-5)
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  bio: string;
  specialization: string;
  phoneNumber: string;
  yearsOfExperience: number;
  
  // Matchmaking fields (steps 6-9)
  coachingStyle: string;
  communicationStyle: string;
  trainingPhilosophy: string;
  specialties: string[];
  positionsCoached: string[];
  skillLevelsAccepted: string[];
  acceptsGroupTraining: boolean;
  acceptsOneOnOne: boolean;
  availableDays: string[];
  availableTimeSlots: string[];
  maxNewClientsPerMonth: number;
  sessionPriceMin: number;
  sessionPriceMax: number;
  travelRadiusMiles: number;
  offersVirtualSessions: boolean;
  offersInPersonSessions: boolean;
  certifications: string[];
  minAgeAccepted: number;
  maxAgeAccepted: number;
}

interface ConversationalCoachSignupProps {
  onSuccess: (email: string) => void;
}

export default function ConversationalCoachSignup({ onSuccess }: ConversationalCoachSignupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CoachFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    zipCode: '',
    bio: '',
    specialization: '',
    phoneNumber: '',
    yearsOfExperience: 0,
    // Matchmaking fields
    coachingStyle: '',
    communicationStyle: '',
    trainingPhilosophy: '',
    specialties: [],
    positionsCoached: [],
    skillLevelsAccepted: [],
    acceptsGroupTraining: false,
    acceptsOneOnOne: true,
    availableDays: [],
    availableTimeSlots: [],
    maxNewClientsPerMonth: 5,
    sessionPriceMin: 0,
    sessionPriceMax: 0,
    travelRadiusMiles: 25,
    offersVirtualSessions: false,
    offersInPersonSessions: true,
    certifications: [],
    minAgeAccepted: 6,
    maxAgeAccepted: 100,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoUploadError, setPhotoUploadError] = useState('');
  const [registeredCoachId, setRegisteredCoachId] = useState<number | null>(null);
  
  const { registerCoach } = useAuth();

  const totalSteps = 10; // Added photo upload step

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('coachSignupDraft');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('coachSignupDraft', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' || name === 'maxNewClientsPerMonth' || 
              name === 'sessionPriceMin' || name === 'sessionPriceMax' || 
              name === 'travelRadiusMiles' || name === 'minAgeAccepted' || name === 'maxAgeAccepted'
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

  const handleMultiSelectChange = (name: keyof CoachFormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
    setError('');
  };

  const handleArrayItemAdd = (name: keyof CoachFormData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [name]: [...(prev[name] as string[]), value.trim()]
      }));
    }
  };

  const handleArrayItemRemove = (name: keyof CoachFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: (prev[name] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleNext = async () => {
    setDirection('forward');
    if (!validateStep()) {
      return;
    }
    
    // Handle registration at step 9 before moving to photo upload step
    if (step === 9) {
      setError('');
      setLoading(true);

      try {
        const { coachId } = await registerCoach(formData);
        setRegisteredCoachId(coachId);
        localStorage.removeItem('coachSignupDraft');
        setStep(10); // Move to photo upload step
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        setError(err.response?.data?.message || 'Failed to register. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
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
        if (formData.password.length < 6) {
          setError('Password should be at least 6 characters for security');
          return false;
        }
        break;
      case 4:
        if (!formData.zipCode.trim()) {
          setError('Please enter your zip code so athletes can find you');
          return false;
        }
        if (!formData.specialization.trim()) {
          setError('Please tell us what position(s) you coach');
          return false;
        }
        break;
      case 6:
        if (!formData.coachingStyle) {
          setError('Please select your coaching style');
          return false;
        }
        if (!formData.communicationStyle) {
          setError('Please select your communication style');
          return false;
        }
        break;
      case 7:
        if (formData.availableDays.length === 0) {
          setError('Please select at least one available day');
          return false;
        }
        if (formData.sessionPriceMin < 0 || formData.sessionPriceMax < 0) {
          setError('Session prices cannot be negative');
          return false;
        }
        if (formData.sessionPriceMax > 0 && formData.sessionPriceMin > formData.sessionPriceMax) {
          setError('Minimum price cannot be greater than maximum price');
          return false;
        }
        break;
      case 8:
        if (formData.skillLevelsAccepted.length === 0) {
          setError('Please select at least one skill level you accept');
          return false;
        }
        if (!formData.acceptsGroupTraining && !formData.acceptsOneOnOne) {
          setError('Please select at least one training format');
          return false;
        }
        break;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    // This is only called on step 10 (photo upload - optional)
    setPhotoUploadError('');
    setLoading(true);

    try {
      // Upload photo if one was selected
      if (profilePhoto && registeredCoachId) {
        try {
          await uploadCoachPhoto(registeredCoachId, profilePhoto);
        } catch (photoError) {
          console.error('Photo upload failed:', photoError);
          setPhotoUploadError('Failed to upload photo, but your account was created successfully.');
        }
      }
      
      // Success - account created (with or without photo)
      onSuccess(formData.email);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPhoto = () => {
    // Skip photo upload and complete registration
    onSuccess(formData.email);
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#f91942] to-[#d01437] rounded-full flex items-center justify-center mb-6">
              <Briefcase size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">
              Welcome, Coach! 👋
            </h2>
            <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              We&apos;re excited to have you join our community! Let&apos;s get to know you better so athletes can find their perfect coach.
            </p>
            <p className="text-gray-500">
              This will only take 2-3 minutes
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
                First, what should we call you?
              </h2>
              <p className="text-gray-600">
                This is how athletes will see your name in their searches.
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
                placeholder="coach@example.com"
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
                helperText="At least 6 characters"
                required
                minLength={6}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Tell us about your coaching
              </h2>
              <p className="text-gray-600">
                Help athletes understand your expertise and find you easily.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <Input
                label="What position(s) do you coach?"
                name="specialization"
                type="text"
                value={formData.specialization}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<Briefcase size={18} />}
                placeholder="e.g., Quarterback, Wide Receiver"
                helperText="You can list multiple positions"
                required
                autoFocus
              />

              <Input
                label="Your Zip Code"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<MapPin size={18} />}
                placeholder="e.g., 90210"
                helperText="This helps local athletes find you"
                required
              />

              <Input
                label="Years of Coaching Experience"
                name="yearsOfExperience"
                type="number"
                value={formData.yearsOfExperience.toString()}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                min="0"
                placeholder="0"
              />

              <Input
                label="Phone Number (Optional)"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                icon={<Phone size={18} />}
                placeholder="(555) 123-4567"
                helperText="Athletes can contact you directly"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Almost there! Tell athletes about yourself
              </h2>
              <p className="text-gray-600">
                Share your coaching philosophy, achievements, or what makes you unique.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bio (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent min-h-[120px]"
                    placeholder="I've been coaching for X years and specialize in... My approach focuses on..."
                    autoFocus
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  A good bio helps you stand out and build trust with athletes
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Pro tip:</strong> Coaches with complete profiles get 3x more inquiries!
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Now, let&apos;s build your matchmaking profile
              </h2>
              <p className="text-gray-600">
                Tell us about your coaching style and philosophy to help athletes find the perfect match.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coaching Style <span className="text-red-500">*</span>
                </label>
                <select
                  name="coachingStyle"
                  value={formData.coachingStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                  autoFocus
                >
                  <option value="">Select your coaching style</option>
                  <option value="Technical">Technical - Focus on mechanics and fundamentals</option>
                  <option value="Motivational">Motivational - Emphasis on mindset and confidence</option>
                  <option value="Balanced">Balanced - Mix of technical and motivational</option>
                  <option value="Disciplined">Disciplined - Structured and rigorous approach</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication Style <span className="text-red-500">*</span>
                </label>
                <select
                  name="communicationStyle"
                  value={formData.communicationStyle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                >
                  <option value="">Select communication style</option>
                  <option value="Frequent">Frequent - Daily check-ins and updates</option>
                  <option value="Weekly">Weekly - Regular weekly updates</option>
                  <option value="As-Needed">As-Needed - Flexible, as needed basis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Philosophy (Optional)
                </label>
                <textarea
                  name="trainingPhilosophy"
                  value={formData.trainingPhilosophy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent min-h-[100px]"
                  placeholder="Describe your approach to training and athlete development..."
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Availability & Pricing
              </h2>
              <p className="text-gray-600">
                Let athletes know when you&apos;re available and your session pricing.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Days <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleMultiSelectChange('availableDays', day)}
                        className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Morning (6am-12pm)', 'Afternoon (12pm-6pm)', 'Evening (6pm-10pm)'].map((slot) => (
                    <label key={slot} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availableTimeSlots.includes(slot)}
                        onChange={() => handleMultiSelectChange('availableTimeSlots', slot)}
                        className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                      />
                      <span className="text-sm text-gray-700">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Session Price Min ($)"
                  name="sessionPriceMin"
                  type="number"
                  value={formData.sessionPriceMin.toString()}
                  onChange={handleChange}
                  min="0"
                  placeholder="50"
                />
                <Input
                  label="Session Price Max ($)"
                  name="sessionPriceMax"
                  type="number"
                  value={formData.sessionPriceMax.toString()}
                  onChange={handleChange}
                  min="0"
                  placeholder="150"
                />
              </div>

              <Input
                label="Max New Clients Per Month"
                name="maxNewClientsPerMonth"
                type="number"
                value={formData.maxNewClientsPerMonth.toString()}
                onChange={handleChange}
                min="0"
                placeholder="5"
              />

              <Input
                label="Travel Radius (miles)"
                name="travelRadiusMiles"
                type="number"
                value={formData.travelRadiusMiles.toString()}
                onChange={handleChange}
                min="0"
                placeholder="25"
                helperText="How far are you willing to travel for sessions?"
              />

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Session Format
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="offersVirtualSessions"
                    checked={formData.offersVirtualSessions}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                  />
                  <span className="text-sm text-gray-700">Offer Virtual Sessions</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="offersInPersonSessions"
                    checked={formData.offersInPersonSessions}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                  />
                  <span className="text-sm text-gray-700">Offer In-Person Sessions</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Athlete Preferences
              </h2>
              <p className="text-gray-600">
                Tell us about the types of athletes you work best with.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Levels Accepted <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Beginner', 'Intermediate', 'Advanced', 'Elite'].map((level) => (
                    <label key={level} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.skillLevelsAccepted.includes(level)}
                        onChange={() => handleMultiSelectChange('skillLevelsAccepted', level)}
                        className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                      />
                      <span className="text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Format <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptsOneOnOne"
                      checked={formData.acceptsOneOnOne}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                    />
                    <span className="text-sm text-gray-700">One-on-One Training</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptsGroupTraining"
                      checked={formData.acceptsGroupTraining}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-[#f91942] border-gray-300 rounded focus:ring-[#f91942]"
                    />
                    <span className="text-sm text-gray-700">Group Training</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Age Accepted"
                  name="minAgeAccepted"
                  type="number"
                  value={formData.minAgeAccepted.toString()}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="6"
                />
                <Input
                  label="Max Age Accepted"
                  name="maxAgeAccepted"
                  type="number"
                  value={formData.maxAgeAccepted.toString()}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Final Details
              </h2>
              <p className="text-gray-600">
                Add your specialties and certifications to complete your matchmaking profile.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialties (Optional)
                </label>
                <div className="space-y-2">
                  {formData.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={specialty}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayItemRemove('specialties', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newSpecialty"
                      placeholder="e.g., Speed Training, Route Running"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          handleArrayItemAdd('specialties', input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newSpecialty') as HTMLInputElement;
                        handleArrayItemAdd('specialties', input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-[#f91942] text-white rounded-lg hover:bg-[#d01437] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications (Optional)
                </label>
                <div className="space-y-2">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cert}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayItemRemove('certifications', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="newCertification"
                      placeholder="e.g., NFLPA Certified, USA Football Coach"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          handleArrayItemAdd('certifications', input.value);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newCertification') as HTMLInputElement;
                        handleArrayItemAdd('certifications', input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-[#f91942] text-white rounded-lg hover:bg-[#d01437] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  🎉 <strong>Great job!</strong> You&apos;re all set to create your account with a complete matchmaking profile!
                </p>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6 py-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                <Camera className="inline-block mr-2 mb-1" size={32} />
                Profile Photo (Optional)
              </h2>
              <p className="text-gray-600">
                Add a professional photo to help athletes connect with you. You can always add or change this later.
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <ImageUpload
                onImageSelect={(file) => {
                  setProfilePhoto(file);
                  setPhotoUploadError('');
                }}
                error={photoUploadError}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> A clear, professional photo helps build trust and can increase your visibility to potential clients.
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
    <Card padding="lg" className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      {step > 1 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {step - 1} of {totalSteps - 1}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((step - 1) / (totalSteps - 1)) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#f91942] to-[#d01437] h-2 rounded-full transition-all duration-500 ease-out"
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
      {step > 1 && step < 10 && (
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
          
          {step < 9 ? (
            <Button
              onClick={handleNext}
              icon={<ArrowRight size={20} />}
              size="lg"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              icon={<ArrowRight size={20} />}
              size="lg"
              isLoading={loading}
            >
              Create My Account
            </Button>
          )}
        </div>
      )}

      {/* Photo Upload Step Buttons */}
      {step === 10 && (
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleSkipPhoto}
            disabled={loading}
          >
            Skip for Now
          </Button>
          
          <div className="flex-1" />
          
          <Button
            onClick={handleSubmit}
            icon={<CheckCircle2 size={20} />}
            size="lg"
            isLoading={loading}
            disabled={!profilePhoto}
          >
            Complete Registration
          </Button>
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
