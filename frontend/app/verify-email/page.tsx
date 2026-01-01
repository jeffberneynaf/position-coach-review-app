'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import api from '@/lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');

      if (!token || !type) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await api.post('/api/auth/verify-email', {
          token,
          userType: type,
        });
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [searchParams]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto">
            <Card padding="lg" className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#274abb] to-[#1e3a8f] rounded-full flex items-center justify-center">
                  <Loader2 size={48} className="text-white animate-spin" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Verifying your email...</h1>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto">
            <Card padding="lg" className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#28a745] to-[#218838] rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h1>
              
              <p className="text-gray-600 mb-6">{message}</p>
              
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
                size="lg"
              >
                Go to Login
              </Button>
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
        <div className="max-w-md mx-auto">
          <Card padding="lg" className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
                <XCircle size={48} className="text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h1>
            
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full" size="lg">
                  Go to Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full" size="lg">
                  Register Again
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-md mx-auto">
            <Card padding="lg" className="text-center">
              <div className="w-16 h-16 mx-auto">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#f91942]"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
