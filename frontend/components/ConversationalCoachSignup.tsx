'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { Mail, Lock, User as UserIcon, MapPin, Phone, Briefcase, FileText, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface CoachFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  bio: string;
  specialization: string;
  phoneNumber: string;
  yearsOfExperience: number;
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
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  
  const { registerCoach } = useAuth();

  const totalSteps = 5;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? (value === '' ? 0 : parseInt(value) || 0) : value
    }));
    setError('');
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
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setError('');
    setLoading(true);

    try {
      await registerCoach(formData);
      localStorage.removeItem('coachSignupDraft');
      onSuccess(formData.email);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
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
