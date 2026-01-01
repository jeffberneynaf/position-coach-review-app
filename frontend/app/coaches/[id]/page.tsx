'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CoachProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import Card from '@/components/Card';
import ReviewCard from '@/components/ReviewCard';
import { Star, MapPin, Phone, Mail, Briefcase, Award, MessageCircle } from 'lucide-react';

export default function CoachProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [coach, setCoach] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoach = useCallback(async () => {
    try {
      const response = await api.get<CoachProfile>(`/api/coaches/${params.id}`);
      setCoach(response.data);
    } catch {
      setError('Failed to load coach profile');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchCoach();
  }, [fetchCoach]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.userType !== 'User') {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/reviews', {
        rating,
        comment,
        coachId: params.id,
      });
      setShowReviewForm(false);
      setRating(5);
      setComment('');
      fetchCoach();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={20} fill="#ffc107" stroke="#ffc107" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} size={20} fill="#ffc107" stroke="#ffc107" className="opacity-50" />);
      } else {
        stars.push(<Star key={i} size={20} stroke="#e0e0e0" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#f91942]"></div>
          <p className="mt-4 text-gray-600">Loading coach profile...</p>
        </div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Coach Not Found</h1>
          <Button onClick={() => router.push('/coaches')}>Back to Coaches</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <section className="gradient-secondary text-white pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-[#274abb] text-4xl font-bold shadow-xl">
                {coach.firstName.charAt(0)}{coach.lastName.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {coach.firstName} {coach.lastName}
                  </h1>
                  <p className="text-xl text-white/90 mb-4">{coach.specialization || 'Position Coach'}</p>
                </div>
                {coach.subscriptionTierName !== 'Free' && (
                  <span className="bg-gradient-to-r from-[#f91942] to-[#d01437] text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <Award size={16} />
                    {coach.subscriptionTierName}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(coach.averageRating)}
                </div>
                <span className="text-2xl font-bold">{coach.averageRating.toFixed(1)}</span>
                <span className="text-white/80">({coach.reviewCount} reviews)</span>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>Zip: {coach.zipCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} />
                  <span>{coach.yearsOfExperience} years experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              {coach.bio ? (
                <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
              ) : (
                <p className="text-gray-500 italic">No bio provided</p>
              )}
            </Card>

            {/* Review Form */}
            {user && user.userType === 'User' && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
                  {!showReviewForm && (
                    <Button
                      onClick={() => setShowReviewForm(true)}
                      icon={<MessageCircle size={18} />}
                    >
                      Add Review
                    </Button>
                  )}
                </div>

                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f91942]"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                        <option value={4}>⭐⭐⭐⭐ Good</option>
                        <option value={3}>⭐⭐⭐ Average</option>
                        <option value={2}>⭐⭐ Below Average</option>
                        <option value={1}>⭐ Poor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f91942]"
                        rows={4}
                        required
                        placeholder="Share your experience with this coach..."
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="submit" isLoading={submitting}>
                        Submit Review
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            )}

            {/* Reviews Section */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Reviews ({coach.reviewCount})
              </h2>
              
              {coach.reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <MessageCircle size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {coach.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-gray-700">
                  <Mail className="text-[#f91942] flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${coach.email}`} className="hover:text-[#f91942] break-all">
                      {coach.email}
                    </a>
                  </div>
                </div>
                {coach.phoneNumber && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <Phone className="text-[#f91942] flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href={`tel:${coach.phoneNumber}`} className="hover:text-[#f91942]">
                        {coach.phoneNumber}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="text-[#f91942] flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>Zip: {coach.zipCode}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stats Card */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-semibold text-gray-900">{coach.yearsOfExperience} years</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Reviews</span>
                  <span className="font-semibold text-gray-900">{coach.reviewCount}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600">Avg Rating</span>
                  <span className="font-semibold text-gray-900">{coach.averageRating.toFixed(1)} ⭐</span>
                </div>
              </div>
            </Card>

            {/* Subscription Card */}
            <Card className="bg-gradient-to-br from-[#274abb] to-[#1e3a8f] text-white">
              <h3 className="text-xl font-bold mb-2">{coach.subscriptionTierName} Member</h3>
              <p className="text-white/90 text-sm">
                This coach is a verified {coach.subscriptionTierName.toLowerCase()} member of our platform.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
