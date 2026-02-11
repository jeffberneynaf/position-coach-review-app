// Athlete Profile Types
export interface AthleteProfile {
  id: number;
  userId: number;
  athleteName: string;
  dateOfBirth: string;
  age: number;
  position: string;
  skillLevel: string;
  zipCode: string;
  trainingIntensity: string;
  preferredSchedule: string;
  sessionsPerWeek: number;
  sessionDuration: string;
  preferredCoachingStyle: string;
  preferredCommunicationStyle: string;
  preferGroupTraining: boolean;
  preferOneOnOne: boolean;
  primaryGoals: string[];
  areasForImprovement: string[];
  specialNeeds: string;
  maxBudgetPerSession: number;
  maxTravelDistanceMiles: number;
  willingToTravel: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAthleteProfileRequest {
  athleteName: string;
  dateOfBirth: string;
  position: string;
  skillLevel: string;
  zipCode: string;
  trainingIntensity: string;
  preferredSchedule: string;
  sessionsPerWeek: number;
  sessionDuration: string;
  preferredCoachingStyle: string;
  preferredCommunicationStyle: string;
  preferGroupTraining: boolean;
  preferOneOnOne: boolean;
  primaryGoals: string[];
  areasForImprovement: string[];
  specialNeeds: string;
  maxBudgetPerSession: number;
  maxTravelDistanceMiles: number;
  willingToTravel: boolean;
}

export interface UpdateAthleteProfileRequest extends CreateAthleteProfileRequest {}

// Coach Match Profile Types
export interface CoachMatchProfile {
  id: number;
  coachId: number;
  coachFirstName: string;
  coachLastName: string;
  coachEmail: string;
  coachingStyle: string;
  communicationStyle: string;
  trainingPhilosophy: string;
  specialties: string[];
  positionsCoached: string;
  skillLevelsAccepted: string;
  acceptsGroupTraining: boolean;
  acceptsOneOnOne: boolean;
  availableDays: string[];
  availableTimeSlots: string[];
  maxNewClientsPerMonth: number;
  sessionPrice: number;
  offersVirtualSessions: boolean;
  offersInPersonSessions: boolean;
  successStories: string[];
  yearsCoachingPosition: number;
  certifications: string[];
  preferredAthleteTraits: string[];
  minAgeAccepted: number;
  maxAgeAccepted: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoachMatchProfileRequest {
  coachingStyle: string;
  communicationStyle: string;
  trainingPhilosophy: string;
  specialties: string[];
  positionsCoached: string;
  skillLevelsAccepted: string;
  acceptsGroupTraining: boolean;
  acceptsOneOnOne: boolean;
  availableDays: string[];
  availableTimeSlots: string[];
  sessionPrice: number;
  offersVirtualSessions: boolean;
  offersInPersonSessions: boolean;
  successStories: string[];
  yearsCoachingPosition: number;
  certifications: string[];
  preferredAthleteTraits: string[];
  minAgeAccepted: number;
  maxAgeAccepted: number;
}

export interface UpdateCoachMatchProfileRequest extends CreateCoachMatchProfileRequest {}

// Match Types
export interface Match {
  id: number;
  athleteProfileId: number;
  athleteProfile?: AthleteProfile;
  coachMatchProfileId: number;
  coachMatchProfile?: CoachMatchProfile;
  matchScore: number;
  matchReasons: string[];
  scoreBreakdown?: MatchScoreBreakdown;
  status: string;
  athleteInterestedAt?: string;
  coachInterestedAt?: string;
  connectedAt?: string;
  athleteNotes: string;
  coachNotes: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  interactions: MatchInteraction[];
}

export interface MatchScoreBreakdown {
  locationScore: number;
  specializationScore: number;
  coachingStyleScore: number;
  scheduleScore: number;
  skillLevelScore: number;
  budgetScore: number;
  trainingFormatScore: number;
  communicationScore: number;
  totalScore: number;
}

export interface MatchInteraction {
  id: number;
  matchId: number;
  actorType: string;
  actorId: number;
  actionType: string;
  message: string;
  createdAt: string;
}

export interface MatchPreference {
  id: number;
  athleteProfileId: number;
  preferenceName: string;
  filtersJson: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface FindMatchesRequest {
  pageNumber?: number;
  pageSize?: number;
  position?: string;
  skillLevel?: string;
  maxPrice?: number;
  maxDistance?: number;
  offersVirtual?: boolean;
  offersInPerson?: boolean;
  coachingStyle?: string;
  minMatchScore?: number;
}

export interface PaginatedMatchesResponse {
  matches: Match[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface MatchInteractionRequest {
  actionType: string;
  message?: string;
}

export interface UpdateMatchStatusRequest {
  status: string;
  notes?: string;
}

export interface MatchmakingStats {
  totalMatches: number;
  suggestedMatches: number;
  interestedMatches: number;
  connectedMatches: number;
  averageMatchScore: number;
  totalInteractions: number;
}
