'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Input from '@/components/Input';
import ReviewCard from '@/components/ReviewCard';
import { Client, Review, DashboardStats, SubscriptionTier } from '@/types';
import { Users, MessageCircle, Star, TrendingUp, Plus, Mail, Phone, User as UserIcon, Check, X } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionTier[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'reviews' | 'subscription'>('overview');
  
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phoneNumber: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.userType !== 'Coach') {
      router.push('/login');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, clientsRes, reviewsRes, subsRes] = await Promise.all([
        api.get<DashboardStats>('/api/dashboard/stats'),
        api.get<Client[]>('/api/dashboard/clients'),
        api.get<Review[]>('/api/dashboard/reviews'),
        api.get<SubscriptionTier[]>('/api/subscriptions'),
      ]);
      
      setStats(statsRes.data);
      setClients(clientsRes.data);
      setReviews(reviewsRes.data);
      setSubscriptions(subsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/dashboard/clients', newClient);
      setNewClient({ name: '', email: '', phoneNumber: '' });
      setShowAddClient(false);
      fetchDashboardData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add client');
    }
  };

  const handleUpgradeSubscription = async (tierId: number) => {
    try {
      await api.put('/api/subscriptions/upgrade', { subscriptionTierId: tierId });
      alert('Subscription updated successfully!');
      fetchDashboardData();
    } catch (err) {
      setError('Failed to upgrade subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#f91942]"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="gradient-secondary text-white pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-2">Coach Dashboard</h1>
          <p className="text-white/90">Welcome back, {user?.firstName}!</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Modern Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-[#f91942] shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'clients'
                ? 'bg-white text-[#f91942] shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Clients ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-white text-[#f91942] shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-6 py-3 font-semibold rounded-lg transition whitespace-nowrap ${
              activeTab === 'subscription'
                ? 'bg-white text-[#f91942] shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            }`}
          >
            Subscription
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card hover className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#274abb]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#274abb] to-[#1e3a8f] rounded-lg flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <TrendingUp className="text-[#28a745]" size={20} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Clients</h3>
                <p className="text-4xl font-bold text-gray-900">{stats.clientCount}</p>
              </div>
            </Card>
            
            <Card hover className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f91942]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f91942] to-[#d01437] rounded-lg flex items-center justify-center">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <TrendingUp className="text-[#28a745]" size={20} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Reviews</h3>
                <p className="text-4xl font-bold text-gray-900">{stats.reviewCount}</p>
              </div>
            </Card>
            
            <Card hover className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffc107]/10 to-transparent rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#ffc107] to-[#ff9800] rounded-lg flex items-center justify-center">
                    <Star className="text-white" size={24} />
                  </div>
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Average Rating</h3>
                <p className="text-4xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Clients</h2>
              <Button
                onClick={() => setShowAddClient(!showAddClient)}
                icon={showAddClient ? <X size={18} /> : <Plus size={18} />}
              >
                {showAddClient ? 'Cancel' : 'Add Client'}
              </Button>
            </div>

            {showAddClient && (
              <Card className="mb-6 bg-gray-50" padding="md">
                <form onSubmit={handleAddClient} className="space-y-4">
                  <Input
                    label="Name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    icon={<UserIcon size={18} />}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    icon={<Mail size={18} />}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={newClient.phoneNumber}
                    onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })}
                    icon={<Phone size={18} />}
                  />
                  <Button type="submit" icon={<Plus size={18} />}>
                    Add Client
                  </Button>
                </form>
              </Card>
            )}

            {clients.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600">No clients yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4 font-medium text-gray-900">{client.name}</td>
                        <td className="py-3 px-4 text-gray-600">{client.email}</td>
                        <td className="py-3 px-4 text-gray-600">{client.phoneNumber}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>
            
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-600">No reviews yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Plans</h2>
            <p className="text-gray-600 mb-8">Choose the plan that fits your coaching needs</p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {subscriptions.map((tier) => (
                <Card
                  key={tier.id}
                  hover
                  className={`relative ${tier.name === 'Premium' ? 'border-2 border-[#f91942]' : ''}`}
                >
                  {tier.name === 'Premium' && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#f91942] to-[#d01437] text-white text-xs font-bold px-4 py-1 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-[#f91942]">${tier.price.toFixed(0)}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <p className="text-sm text-gray-600">{tier.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3 text-gray-700">
                      <Check size={20} className="text-[#28a745] flex-shrink-0" />
                      <span>Up to {tier.maxClients} clients</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      {tier.featuredListing ? (
                        <Check size={20} className="text-[#28a745] flex-shrink-0" />
                      ) : (
                        <X size={20} className="text-gray-400 flex-shrink-0" />
                      )}
                      <span className={!tier.featuredListing ? 'text-gray-400' : ''}>
                        Featured listing
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      {tier.analyticsAccess ? (
                        <Check size={20} className="text-[#28a745] flex-shrink-0" />
                      ) : (
                        <X size={20} className="text-gray-400 flex-shrink-0" />
                      )}
                      <span className={!tier.analyticsAccess ? 'text-gray-400' : ''}>
                        Analytics access
                      </span>
                    </li>
                  </ul>

                  <Button
                    onClick={() => handleUpgradeSubscription(tier.id)}
                    className="w-full"
                    variant={tier.name === 'Premium' ? 'primary' : 'outline'}
                  >
                    Select Plan
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
