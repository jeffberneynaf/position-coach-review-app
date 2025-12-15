'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CoachProfile, Review } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

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

  useEffect(() => {
    fetchCoach();
  }, [params.id]);

  const fetchCoach = async () => {
    try {
      const response = await api.get<CoachProfile>(`/coaches/${params.id}`);
      setCoach(response.data);
    } catch (err) {
      setError('Failed to load coach profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.userType !== 'User') {
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reviews', {
        rating,
        comment,
        coachId: params.id,
      });
      setShowReviewForm(false);
      setRating(5);
      setComment('');
      fetchCoach(); // Refresh to show new review
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
      </div>
    );
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">Coach not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {coach.firstName} {coach.lastName}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{coach.specialization || 'Position Coach'}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              {coach.subscriptionTierName}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="font-bold mb-2">Rating</h3>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{renderStars(coach.averageRating)}</span>
                <span className="text-xl text-gray-600">
                  {coach.averageRating.toFixed(1)} ({coach.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Contact Info</h3>
              <p className="text-gray-700">📍 Zip Code: {coach.zipCode}</p>
              {coach.phoneNumber && (
                <p className="text-gray-700">📞 {coach.phoneNumber}</p>
              )}
              <p className="text-gray-700">✉️ {coach.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Experience</h3>
            <p className="text-gray-700">{coach.yearsOfExperience} years of coaching experience</p>
          </div>

          {coach.bio && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">About</h3>
              <p className="text-gray-700">{coach.bio}</p>
            </div>
          )}

          {user && user.userType === 'User' && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-4">Submit Your Review</h3>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ Good</option>
                  <option value={3}>⭐⭐⭐ Average</option>
                  <option value={2}>⭐⭐ Below Average</option>
                  <option value={1}>⭐ Poor</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows={4}
                  required
                  placeholder="Share your experience with this coach..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Reviews ({coach.reviewCount})</h2>
          
          {coach.reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-6">
              {coach.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xl">{renderStars(review.rating)}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
