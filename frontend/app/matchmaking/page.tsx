'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Users, Search, Heart, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function MatchmakingHub() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const features = [
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: 'Smart Matching',
      description: 'Our advanced algorithm considers location, specialization, coaching style, schedule, and more to find your perfect match.',
    },
    {
      icon: <Search className="w-12 h-12 text-blue-600" />,
      title: 'Browse & Filter',
      description: 'Explore coaches that meet your specific criteria with powerful filtering and search capabilities.',
    },
    {
      icon: <Heart className="w-12 h-12 text-blue-600" />,
      title: 'Express Interest',
      description: 'Like coaches you\'re interested in. When the interest is mutual, you can connect directly.',
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      title: 'Track Progress',
      description: 'Monitor your matches, interactions, and connection status all in one place.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our intelligent matchmaking system connects athletes with coaches based on compatibility across multiple factors
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Get Started
          </h2>
          
          {user?.userType === 'User' ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-6">
                Create your athlete profile to start finding coaches that match your needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/matchmaking/athlete-profile')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Create Athlete Profile
                </button>
                <button
                  onClick={() => router.push('/matchmaking/browse')}
                  className="px-8 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg"
                >
                  Browse Coaches
                </button>
              </div>
            </div>
          ) : user?.userType === 'Coach' ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600 mb-6">
                Set up your match profile to help athletes find you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/matchmaking/coach-profile')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  Create Coach Profile
                </button>
                <button
                  onClick={() => router.push('/matchmaking/matches')}
                  className="px-8 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-lg"
                >
                  View Matches
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Tell us about your training needs, goals, and preferences
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Matches</h3>
              <p className="text-gray-600">
                Our algorithm finds coaches with high compatibility scores
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Express interest and connect with coaches when it's mutual
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
