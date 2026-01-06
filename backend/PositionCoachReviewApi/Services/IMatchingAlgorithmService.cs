using PositionCoachReviewApi.Models;
using PositionCoachReviewApi.Models.DTOs;

namespace PositionCoachReviewApi.Services;

public interface IMatchingAlgorithmService
{
    Task<(double score, MatchScoreBreakdown breakdown, List<string> reasons)> CalculateMatchScore(
        AthleteProfile athleteProfile, 
        CoachMatchProfile coachProfile,
        Coach coach,
        ZipCode? athleteZipCode,
        ZipCode? coachZipCode);
}
