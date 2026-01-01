'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { Mail, Lock, User as UserIcon, MapPin, Phone, Briefcase, FileText, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [userType, setUserType] = useState<'user' | 'coach'>('user');
  const [formData, setFormData] = useState({
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
  const [success, setSuccess] = useState(false);
  
  const { registerUser, registerCoach } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (userType === 'user') {
        await registerUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      } else {
        await registerCoach({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          zipCode: formData.zipCode,
          bio: formData.bio,
          specialization: formData.specialization,
          phoneNumber: formData.phoneNumber,
          yearsOfExperience: formData.yearsOfExperience,
        });
      }
      setSuccess(true);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto">
            <Card padding="lg" className="text-center">
              <div className="mb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#28a745] to-[#218838] rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email!</h1>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                We&apos;ve sent a verification link to <strong className="text-gray-900">{formData.email}</strong>. 
                Please check your inbox and click the link to verify your account.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  💡 The verification link will expire in 24 hours.
                </p>
              </div>
              
              <Link href="/login">
                <Button className="w-full" size="lg">
                  Go to Login
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto">
          <Card padding="lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join our community today</p>
            </div>
            
            {/* User Type Toggle */}
            <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                  userType === 'user'
                    ? 'bg-white text-[#f91942] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                I&apos;m an Athlete
              </button>
              <button
                type="button"
                onClick={() => setUserType('coach')}
                className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
                  userType === 'coach'
                    ? 'bg-white text-[#f91942] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                I&apos;m a Coach
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  icon={<UserIcon size={18} />}
                  required
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  icon={<UserIcon size={18} />}
                  required
                />
              </div>

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail size={18} />}
                placeholder="your@email.com"
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                icon={<Lock size={18} />}
                helperText="Must be at least 6 characters"
                required
                minLength={6}
              />

              {userType === 'coach' && (
                <>
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach Information</h3>
                  </div>

                  <Input
                    label="Zip Code"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    icon={<MapPin size={18} />}
                    required
                  />

                  <Input
                    label="Specialization"
                    name="specialization"
                    type="text"
                    value={formData.specialization}
                    onChange={handleChange}
                    icon={<Briefcase size={18} />}
                    placeholder="e.g., Quarterback, Wide Receiver"
                  />

                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    icon={<Phone size={18} />}
                  />

                  <Input
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    value={formData.yearsOfExperience.toString()}
                    onChange={handleChange}
                    min="0"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#f91942] focus:border-transparent"
                        rows={4}
                        placeholder="Tell athletes about your coaching experience..."
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={loading}
                >
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-[#f91942] font-semibold hover:text-[#d01437]">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-[#274abb] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[#274abb] hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
