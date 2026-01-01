'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CoachProfile } from '@/types';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import CoachCard from '@/components/CoachCard';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

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

  const handleClear = () => {
    setZipCode('');
    setRadius('10');
    setFilteredCoaches(coaches);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Search Section */}
      <section className="gradient-secondary text-white pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Find Your Coach</h1>
          <p className="text-xl text-center text-white/90 mb-8">
            Discover expert position coaches in your area
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Enter zip code..."
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942]"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="relative">
                  <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f91942] appearance-none"
                  >
                    <option value="5">5 miles</option>
                    <option value="10">10 miles</option>
                    <option value="25">25 miles</option>
                    <option value="50">50 miles</option>
                    <option value="100">100 miles</option>
                  </select>
                </div>
              </div>
              
              <div className="md:col-span-3 flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1"
                  icon={<Search size={20} />}
                >
                  Search
                </Button>
                {zipCode && (
                  <Button
                    onClick={handleClear}
                    variant="ghost"
                    className="px-3"
                    icon={<X size={20} />}
                  >
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-sm">!</div>
            {error}
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredCoaches.length} {filteredCoaches.length === 1 ? 'Coach' : 'Coaches'} Found
            </h2>
            <p className="text-gray-600 mt-1">
              {zipCode ? `Within ${radius} miles of ${zipCode}` : 'All available coaches'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#f91942]"></div>
            <p className="mt-4 text-gray-600">Loading coaches...</p>
          </div>
        ) : filteredCoaches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No coaches found</h3>
            <p className="text-gray-600 mb-6">
              {zipCode 
                ? 'Try expanding your search radius or changing the location.' 
                : 'No coaches are currently available.'}
            </p>
            {zipCode && (
              <Button onClick={handleClear} variant="outline">
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoaches.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
