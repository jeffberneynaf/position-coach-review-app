'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ConversationalCoachSignup from '@/components/ConversationalCoachSignup';
import ConversationalAthleteSignup from '@/components/ConversationalAthleteSignup';
import { CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [userType, setUserType] = useState<'user' | 'coach'>('user');
  const [success, setSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState('');
  
  const handleCoachSignupSuccess = (email: string) => {
    setSuccessEmail(email);
    setSuccess(true);
  };

  const handleUserSignupSuccess = (email: string) => {
    setSuccessEmail(email);
    setSuccess(true);
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
                We&apos;ve sent a verification link to <strong className="text-gray-900">{successEmail}</strong>. 
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
          {/* Conversational Athlete Signup */}
          {userType === 'user' && (
            <>
              <div className="text-center mb-8">
                <button
                  type="button"
                  onClick={() => setUserType('coach')}
                  className="text-sm text-gray-600 hover:text-gray-900 underline mb-4"
                  aria-label="Switch to coach registration"
                >
                  ← Are you a coach? Register here
                </button>
              </div>
              <ConversationalAthleteSignup onSuccess={handleUserSignupSuccess} />
            </>
          )}

          {/* Conversational Coach Signup */}
          {userType === 'coach' && (
            <>
              <div className="text-center mb-8">
                <button
                  type="button"
                  onClick={() => setUserType('user')}
                  className="text-sm text-gray-600 hover:text-gray-900 underline mb-4"
                  aria-label="Go back to account type selection"
                >
                  ← Back to account type selection
                </button>
              </div>
              <ConversationalCoachSignup onSuccess={handleCoachSignupSuccess} />
            </>
          )}

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
