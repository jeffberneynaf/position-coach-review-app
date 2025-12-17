'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Client, Review, DashboardStats, SubscriptionTier } from '@/types';

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
        <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Coach Dashboard</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-8 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'clients'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Clients ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'reviews'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'subscription'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Subscription
          </button>
        </div>

        {activeTab === 'overview' && stats && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Total Clients</h3>
              <p className="text-4xl font-bold text-blue-600">{stats.clientCount}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Total Reviews</h3>
              <p className="text-4xl font-bold text-blue-600">{stats.reviewCount}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-2">Average Rating</h3>
              <p className="text-4xl font-bold text-blue-600">
                {stats.averageRating.toFixed(1)} ⭐
              </p>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Clients</h2>
              <button
                onClick={() => setShowAddClient(!showAddClient)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {showAddClient ? 'Cancel' : 'Add Client'}
              </button>
            </div>

            {showAddClient && (
              <form onSubmit={handleAddClient} className="mb-6 p-6 bg-gray-50 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newClient.phoneNumber}
                    onChange={(e) => setNewClient({ ...newClient, phoneNumber: e.target.value })}
                    className="px-4 py-2 border rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Client
                </button>
              </form>
            )}

            {clients.length === 0 ? (
              <p className="text-gray-600">No clients yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Phone</th>
                      <th className="text-left py-3 px-4">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{client.name}</td>
                        <td className="py-3 px-4">{client.email}</td>
                        <td className="py-3 px-4">{client.phoneNumber}</td>
                        <td className="py-3 px-4">
                          {new Date(client.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
            
            {reviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xl">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'subscription' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Subscription Tiers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {subscriptions.map((tier) => (
                <div
                  key={tier.id}
                  className="bg-white rounded-lg shadow-md p-6 border-2 hover:border-blue-600 transition"
                >
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-4">
                    ${tier.price.toFixed(2)}/mo
                  </p>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Up to {tier.maxClients} clients
                    </li>
                    <li className="flex items-center gap-2">
                      {tier.featuredListing ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                      Featured listing
                    </li>
                    <li className="flex items-center gap-2">
                      {tier.analyticsAccess ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                      Analytics access
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgradeSubscription(tier.id)}
                    className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
