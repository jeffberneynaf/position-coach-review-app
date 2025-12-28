'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { CoachProfile } from '@/types';
import Navbar from '@/components/Navbar';

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<CoachProfile[]>([]);
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('10');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await api.get<CoachProfile[]>('/api/coaches');
      setCoaches(response.data);
      setFilteredCoaches(response.data);
    } catch (err) {
      setError('Failed to load coaches');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!zipCode.trim()) {
      setFilteredCoaches(coaches);
      return;
    }

    try {
      const response = await api.get<CoachProfile[]>(`/api/coaches/search?zipCode=${zipCode}&radius=${radius}`);
      setFilteredCoaches(response.data);
    } catch (err) {
      setError('Failed to search coaches');
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Find a Coach</h1>

        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Enter zip code..."
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex items-center gap-2">
              <label htmlFor="radius" className="text-gray-700 whitespace-nowrap">
                Radius:
              </label>
              <select
                id="radius"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
            <button
              onClick={() => {
                setZipCode('');
                setRadius('10');
                setFilteredCoaches(coaches);
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading coaches...</div>
        ) : filteredCoaches.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No coaches found. Try a different zip code.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <Link
                key={coach.id}
                href={`/coaches/${coach.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      {coach.firstName} {coach.lastName}
                    </h3>
                    <p className="text-gray-600">{coach.specialization || 'Position Coach'}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {coach.subscriptionTierName}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{renderStars(coach.averageRating)}</span>
                    <span className="text-gray-600">
                      {coach.averageRating.toFixed(1)} ({coach.reviewCount} reviews)
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    📍 Zip: {coach.zipCode}
                  </p>
                  <p className="text-gray-600 text-sm">
                    🎓 {coach.yearsOfExperience} years experience
                  </p>
                </div>

                {coach.bio && (
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {coach.bio}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
