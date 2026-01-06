import axios from 'axios';
import type {
  CreateAthleteProfileRequest,
  UpdateAthleteProfileRequest,
  AthleteProfile,
  CreateCoachMatchProfileRequest,
  UpdateCoachMatchProfileRequest,
  CoachMatchProfile,
  FindMatchesRequest,
  PaginatedMatchesResponse,
  Match,
  MatchInteractionRequest,
  UpdateMatchStatusRequest,
  MatchmakingStats,
} from '@/types/matchmaking';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Matchmaking API endpoints
export const matchmakingApi = {
  // Athlete Profile
  createAthleteProfile: (data: CreateAthleteProfileRequest) =>
    api.post<AthleteProfile>('/matchmaking/athlete-profile', data),
  
  getAthleteProfile: () =>
    api.get<AthleteProfile>('/matchmaking/athlete-profile'),
  
  updateAthleteProfile: (data: UpdateAthleteProfileRequest) =>
    api.put<AthleteProfile>('/matchmaking/athlete-profile', data),

  // Coach Match Profile
  createCoachMatchProfile: (data: CreateCoachMatchProfileRequest) =>
    api.post<CoachMatchProfile>('/matchmaking/coach-profile', data),
  
  getCoachMatchProfile: () =>
    api.get<CoachMatchProfile>('/matchmaking/coach-profile'),
  
  updateCoachMatchProfile: (data: UpdateCoachMatchProfileRequest) =>
    api.put<CoachMatchProfile>('/matchmaking/coach-profile', data),

  // Matches
  findMatches: (data: FindMatchesRequest) =>
    api.post<PaginatedMatchesResponse>('/matchmaking/find-matches', data),
  
  getMatches: (status?: string) =>
    api.get<Match[]>('/matchmaking/matches', { params: { status } }),
  
  getMatch: (id: number) =>
    api.get<Match>(`/matchmaking/matches/${id}`),
  
  interactWithMatch: (id: number, data: MatchInteractionRequest) =>
    api.post<Match>(`/matchmaking/matches/${id}/interact`, data),
  
  updateMatchStatus: (id: number, data: UpdateMatchStatusRequest) =>
    api.put<Match>(`/matchmaking/matches/${id}/status`, data),
  
  getStats: () =>
    api.get<MatchmakingStats>('/matchmaking/stats'),
};

export default api;
