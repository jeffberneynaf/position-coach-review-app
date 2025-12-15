export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'User' | 'Coach';
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'User' | 'Coach';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterCoachRequest extends RegisterUserRequest {
  zipCode: string;
  bio?: string;
  specialization?: string;
  phoneNumber?: string;
  yearsOfExperience?: number;
}

export interface CoachProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  specialization: string;
  zipCode: string;
  phoneNumber: string;
  yearsOfExperience: number;
  subscriptionTierName: string;
  averageRating: number;
  reviewCount: number;
  reviews: Review[];
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
  coachId: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface SubscriptionTier {
  id: number;
  name: string;
  price: number;
  description: string;
  maxClients: number;
  featuredListing: boolean;
  analyticsAccess: boolean;
}

export interface DashboardStats {
  clientCount: number;
  reviewCount: number;
  averageRating: number;
}

export interface UpdateCoachProfileRequest {
  bio: string;
  specialization: string;
  zipCode: string;
  phoneNumber: string;
  yearsOfExperience: number;
}

export interface UpgradeSubscriptionRequest {
  subscriptionTierId: number;
}
