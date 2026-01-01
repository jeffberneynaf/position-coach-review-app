import { Review } from '@/types';
import Card from './Card';
import { Star, Calendar } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  showCoachName?: boolean;
}

export default function ReviewCard({ review, showCoachName = false }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<Star key={i} size={16} fill="#ffc107" stroke="#ffc107" />);
      } else {
        stars.push(<Star key={i} size={16} stroke="#e0e0e0" />);
      }
    }
    return stars;
  };

  return (
    <Card padding="md" className="border border-gray-100">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-[#274abb] to-[#1e3a8f] rounded-full flex items-center justify-center text-white font-bold">
            {review.userName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar size={14} />
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </Card>
  );
}
