'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import api from '@/lib/api';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [userType, setUserType] = useState<'user' | 'coach'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResendVerification(false);
    setResendMessage('');
    setLoading(true);

    try {
      await login({ email, password }, userType);
      if (userType === 'coach') {
        router.push('/dashboard');
      } else {
        router.push('/coaches');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { emailNotVerified?: boolean; message?: string } } };
      const errorData = err.response?.data;
      if (errorData?.emailNotVerified) {
        setError(errorData.message || 'Please verify your email before logging in');
        setShowResendVerification(true);
      } else {
        setError(errorData?.message || 'Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendMessage('');
    setError('');

    try {
      const userTypeCapitalized = userType === 'user' ? 'User' : 'Coach';
      await api.post('/api/auth/resend-verification', {
        email,
        userType: userTypeCapitalized,
      });
      setResendMessage('Verification email sent! Please check your inbox.');
      setShowResendVerification(false);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-md mx-auto">
          <Card padding="lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>
            
            {/* User Type Toggle - Modern Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all ${
                  userType === 'user'
                    ? 'bg-white text-[#f91942] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Athlete
              </button>
              <button
                type="button"
                onClick={() => setUserType('coach')}
                className={`flex-1 py-2.5 px-4 rounded-md font-semibold transition-all ${
                  userType === 'coach'
                    ? 'bg-white text-[#f91942] shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Coach
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {showResendVerification && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
                <p className="text-sm mb-2">Your email has not been verified yet.</p>
                <button
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className="text-sm font-semibold underline hover:no-underline disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            )}

            {resendMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-3">
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{resendMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} />}
                placeholder="your@email.com"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={18} />}
                placeholder="Enter your password"
                required
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-[#f91942] font-semibold hover:text-[#d01437]">
                  Sign up
                </Link>
              </p>
            </div>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
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
