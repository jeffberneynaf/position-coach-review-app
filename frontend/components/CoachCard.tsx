import Link from 'next/link';
import { CoachProfile } from '@/types';
import Card from './Card';
import { Star, MapPin, Award, Briefcase } from 'lucide-react';

interface CoachCardProps {
  coach: CoachProfile;
}

export default function CoachCard({ coach }: CoachCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} size={16} fill="#ffc107" stroke="#ffc107" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} size={16} fill="#ffc107" stroke="#ffc107" className="opacity-50" />);
      } else {
        stars.push(<Star key={i} size={16} stroke="#e0e0e0" />);
      }
    }
    return stars;
  };

  return (
    <Link href={`/coaches/${coach.id}`}>
      <Card hover className="h-full relative overflow-hidden group">
        {/* Featured Badge */}
        {coach.subscriptionTierName !== 'Free' && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-[#f91942] to-[#d01437] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Award size={12} />
              Featured
            </div>
          </div>
        )}

        {/* Avatar Placeholder */}
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#274abb] to-[#1e3a8f] rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {coach.firstName.charAt(0)}{coach.lastName.charAt(0)}
        </div>

        {/* Coach Info */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#f91942] transition">
            {coach.firstName} {coach.lastName}
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            {coach.specialization || 'Position Coach'}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(coach.averageRating)}
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {coach.averageRating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500">
            ({coach.reviewCount})
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <MapPin size={16} className="text-[#f91942]" />
            <span>Zip: {coach.zipCode}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Briefcase size={16} className="text-[#274abb]" />
            <span>{coach.yearsOfExperience} years experience</span>
          </div>
        </div>

        {/* Bio Preview */}
        {coach.bio && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 px-2">
            {coach.bio}
          </p>
        )}

        {/* Tier Badge */}
        <div className="pt-4 border-t border-gray-100">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            coach.subscriptionTierName === 'Premium' 
              ? 'bg-gradient-to-r from-[#f91942] to-[#d01437] text-white' 
              : coach.subscriptionTierName === 'Standard'
              ? 'bg-gradient-to-r from-[#274abb] to-[#1e3a8f] text-white'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {coach.subscriptionTierName} Plan
          </span>
        </div>
      </Card>
    </Link>
  );
}
