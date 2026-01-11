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
  // Athlete profile fields (optional)
  athleteName?: string;
  dateOfBirth?: string;
  position?: string;
  skillLevel?: string;
  zipCode?: string;
  trainingIntensity?: string;
  preferredSchedule?: string;
  sessionDuration?: string;
  sessionsPerWeek?: number;
  preferredCoachingStyle?: string;
  preferredCommunicationStyle?: string;
  preferGroupTraining?: boolean;
  preferOneOnOne?: boolean;
  willingToTravel?: boolean;
  primaryGoals?: string[];
  areasForImprovement?: string[];
  specialNeeds?: string;
  maxBudgetPerSession?: number;
  maxTravelDistanceMiles?: number;
}

export interface RegisterCoachRequest extends RegisterUserRequest {
  zipCode: string;
  bio?: string;
  specialization?: string;
  phoneNumber?: string;
  yearsOfExperience?: number;
  // Matchmaking fields (optional)
  coachingStyle?: string;
  communicationStyle?: string;
  trainingPhilosophy?: string;
  specialties?: string[];
  positionsCoached?: string[];
  skillLevelsAccepted?: string[];
  acceptsGroupTraining?: boolean;
  acceptsOneOnOne?: boolean;
  availableDays?: string[];
  availableTimeSlots?: string[];
  maxNewClientsPerMonth?: number;
  sessionPriceMin?: number;
  sessionPriceMax?: number;
  travelRadiusMiles?: number;
  offersVirtualSessions?: boolean;
  offersInPersonSessions?: boolean;
  certifications?: string[];
  minAgeAccepted?: number;
  maxAgeAccepted?: number;
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
  profilePhotoUrl?: string;
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
