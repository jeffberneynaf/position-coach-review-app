using System.Text.Json;
using PositionCoachReviewApi.Models;
using PositionCoachReviewApi.Models.DTOs;
using PositionCoachReviewApi.Utils;

namespace PositionCoachReviewApi.Services;

public class MatchingAlgorithmService : IMatchingAlgorithmService
{
    public async Task<(double score, MatchScoreBreakdown breakdown, List<string> reasons)> CalculateMatchScore(
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        Coach coach,
        ZipCode? athleteZipCode,
        ZipCode? coachZipCode)
    {
        var breakdown = new MatchScoreBreakdown();
        var reasons = new List<string>();

        // 1. Location Score (20 points)
        breakdown.LocationScore = await Task.Run(() => CalculateLocationScore(
            athleteProfile, athleteZipCode, coachZipCode, coachProfile, reasons));

        // 2. Specialization Score (20 points)
        breakdown.SpecializationScore = CalculateSpecializationScore(
            athleteProfile, coachProfile, reasons);

        // 3. Coaching Style Score (15 points)
        breakdown.CoachingStyleScore = CalculateCoachingStyleScore(
            athleteProfile, coachProfile, reasons);

        // 4. Schedule Score (15 points)
        breakdown.ScheduleScore = CalculateScheduleScore(
            athleteProfile, coachProfile, reasons);

        // 5. Skill Level Score (10 points)
        breakdown.SkillLevelScore = CalculateSkillLevelScore(
            athleteProfile, coachProfile, reasons);

        // 6. Budget Score (10 points)
        breakdown.BudgetScore = CalculateBudgetScore(
            athleteProfile, coachProfile, reasons);

        // 7. Training Format Score (5 points)
        breakdown.TrainingFormatScore = CalculateTrainingFormatScore(
            athleteProfile, coachProfile, reasons);

        // 8. Communication Score (5 points)
        breakdown.CommunicationScore = CalculateCommunicationScore(
            athleteProfile, coachProfile, reasons);

        // Calculate total score
        breakdown.TotalScore = breakdown.LocationScore +
                              breakdown.SpecializationScore +
                              breakdown.CoachingStyleScore +
                              breakdown.ScheduleScore +
                              breakdown.SkillLevelScore +
                              breakdown.BudgetScore +
                              breakdown.TrainingFormatScore +
                              breakdown.CommunicationScore;

        // Keep only top reasons
        const int MaxMatchReasons = 5;
        reasons = reasons.Take(MaxMatchReasons).ToList();

        return (breakdown.TotalScore, breakdown, reasons);
    }

    private double CalculateLocationScore(
        AthleteProfile athleteProfile,
        ZipCode? athleteZipCode,
        ZipCode? coachZipCode,
        CoachMatchProfile coachProfile,
        List<string> reasons)
    {
        const double maxPoints = 20.0;

        // If either zipcode is missing, give partial score
        if (athleteZipCode == null || coachZipCode == null)
        {
            return maxPoints * 0.5;
        }

        // Calculate distance using Haversine formula
        var distance = GeoUtils.CalculateDistance(
            athleteZipCode.Latitude,
            athleteZipCode.Longitude,
            coachZipCode.Latitude,
            coachZipCode.Longitude);

        // Check if within athlete's max travel distance
        if (distance <= athleteProfile.MaxTravelDistanceMiles)
        {
            reasons.Add($"Coach is only {distance:F1} miles away - within your preferred range");
            return maxPoints;
        }
        // If coach offers virtual and athlete is willing
        else if (coachProfile.OffersVirtualSessions)
        {
            reasons.Add("Offers virtual training sessions");
            return maxPoints * 0.6;
        }
        // Outside range but give some credit
        else
        {
            var ratio = athleteProfile.MaxTravelDistanceMiles / Math.Max(distance, 1);
            return maxPoints * Math.Min(ratio, 0.5);
        }
    }

    private double CalculateSpecializationScore(
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        List<string> reasons)
    {
        const double maxPoints = 20.0;
        var score = 0.0;

        // Check if coach specializes in athlete's position
        if (!string.IsNullOrEmpty(coachProfile.PositionsCoached) &&
            coachProfile.PositionsCoached.Contains(athleteProfile.Position, StringComparison.OrdinalIgnoreCase))
        {
            score += maxPoints * 0.7;
            reasons.Add($"Specializes in {athleteProfile.Position} position");
        }

        // Check goal alignment
        try
        {
            var athleteGoals = JsonSerializer.Deserialize<List<string>>(athleteProfile.PrimaryGoalsJson) ?? new List<string>();
            var coachSpecialties = JsonSerializer.Deserialize<List<string>>(coachProfile.SpecialtiesJson) ?? new List<string>();

            var matchingGoals = athleteGoals
                .Where(goal => coachSpecialties.Any(s => s.Contains(goal, StringComparison.OrdinalIgnoreCase)))
                .ToList();

            if (matchingGoals.Any())
            {
                score += maxPoints * 0.3;
                reasons.Add($"Matches your training goals: {string.Join(", ", matchingGoals.Take(2))}");
            }
        }
        catch (JsonException)
        {
            // If JSON parsing fails, give partial credit
            const double PartialCreditPercentage = 0.15;
            score += maxPoints * PartialCreditPercentage;
        }

        return score;
    }

    private double CalculateCoachingStyleScore(
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        List<string> reasons)
    {
        const double maxPoints = 15.0;

        if (string.IsNullOrEmpty(athleteProfile.PreferredCoachingStyle) ||
            string.IsNullOrEmpty(coachProfile.CoachingStyle))
        {
            return maxPoints * 0.5;
        }

        // Check for exact or similar match
        if (athleteProfile.PreferredCoachingStyle.Equals(coachProfile.CoachingStyle, StringComparison.OrdinalIgnoreCase))
        {
            reasons.Add($"Perfect match: {coachProfile.CoachingStyle} coaching style");
            return maxPoints;
        }

        // Give partial credit for compatible styles
        var compatibleStyles = new Dictionary<string, List<string>>
        {
            { "Motivational", new List<string> { "Encouraging", "Supportive", "Positive" } },
            { "Technical", new List<string> { "Analytical", "Detail-oriented", "Structured" } },
            { "Holistic", new List<string> { "Balanced", "Comprehensive", "Developmental" } }
        };

        foreach (var pair in compatibleStyles)
        {
            if ((athleteProfile.PreferredCoachingStyle.Contains(pair.Key, StringComparison.OrdinalIgnoreCase) &&
                 pair.Value.Any(s => coachProfile.CoachingStyle.Contains(s, StringComparison.OrdinalIgnoreCase))) ||
                (coachProfile.CoachingStyle.Contains(pair.Key, StringComparison.OrdinalIgnoreCase) &&
                 pair.Value.Any(s => athleteProfile.PreferredCoachingStyle.Contains(s, StringComparison.OrdinalIgnoreCase))))
            {
                reasons.Add($"Compatible {coachProfile.CoachingStyle} coaching approach");
                return maxPoints * 0.7;
            }
        }

        return maxPoints * 0.4;
    }

    private double CalculateScheduleScore(
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        List<string> reasons)
    {
        const double maxPoints = 15.0;

        try
        {
            var availableDays = JsonSerializer.Deserialize<List<string>>(coachProfile.AvailableDaysJson) ?? new List<string>();
            
            if (!availableDays.Any())
            {
                return maxPoints * 0.5;
            }

            // Parse athlete's preferred schedule (e.g., "Weekdays", "Weekends", "Flexible")
            var preferredSchedule = athleteProfile.PreferredSchedule.ToLower();

            if (preferredSchedule.Contains("flexible"))
            {
                reasons.Add("Flexible schedule availability");
                return maxPoints;
            }

            if (preferredSchedule.Contains("weekend") && 
                availableDays.Any(d => d.Contains("Saturday", StringComparison.OrdinalIgnoreCase) || 
                                      d.Contains("Sunday", StringComparison.OrdinalIgnoreCase)))
            {
                reasons.Add("Available on weekends");
                return maxPoints * 0.9;
            }

            if (preferredSchedule.Contains("weekday") &&
                availableDays.Any(d => !d.Contains("Saturday", StringComparison.OrdinalIgnoreCase) && 
                                      !d.Contains("Sunday", StringComparison.OrdinalIgnoreCase)))
            {
                reasons.Add("Available on weekdays");
                return maxPoints * 0.9;
            }

            // Check if coach has availability for athlete's sessions per week
            if (availableDays.Count >= athleteProfile.SessionsPerWeek)
            {
                return maxPoints * 0.7;
            }

            return maxPoints * 0.5;
        }
        catch
        {
            return maxPoints * 0.5;
        }
    }

    private double CalculateSkillLevelScore(
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        List<string> reasons)
    {
        const double maxPoints = 10.0;

        if (string.IsNullOrEmpty(coachProfile.SkillLevelsAccepted))
        {
            return maxPoints * 0.5;
        }

        // Check if coach accepts athlete's skill level
        if (coachProfile.SkillLevelsAccepted.Contains(athleteProfile.SkillLevel, StringComparison.OrdinalIgnoreCase))
        {
            reasons.Add($"Experienced with {athleteProfile.SkillLevel} athletes");
            return maxPoints;
        }

        // Give partial credit if coach accepts "All Levels"
        if (coachProfile.SkillLevelsAccepted.Contains("All", StringComparison.OrdinalIgnoreCase))
        {
            reasons.Add("Works with all skill levels");
            return maxPoints * 0.8;
        }

        return maxPoints * 0.3;
    }

    private double CalculateBudgetScore(
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        List<string> reasons)
    {
        const double maxPoints = 10.0;

        // If athlete's budget is at or above the coach's price
        if (athleteProfile.MaxBudgetPerSession >= coachProfile.SessionPrice)
        {
            reasons.Add($"Sessions at ${coachProfile.SessionPrice} fit your budget");
            return maxPoints;
        }

        // If athlete's budget is close (within 80%)
        if (athleteProfile.MaxBudgetPerSession >= coachProfile.SessionPrice * 0.8m)
        {
            return maxPoints * 0.6;
        }

        // Budget doesn't match well
        return maxPoints * 0.2;
    }

    private double CalculateTrainingFormatScore(
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        List<string> reasons)
    {
        const double maxPoints = 5.0;

        var athleteWantsOneOnOne = athleteProfile.PreferOneOnOne;
        var athleteWantsGroup = athleteProfile.PreferGroupTraining;
        var coachOffersOneOnOne = coachProfile.AcceptsOneOnOne;
        var coachOffersGroup = coachProfile.AcceptsGroupTraining;

        // Perfect match
        if ((athleteWantsOneOnOne && coachOffersOneOnOne) || (athleteWantsGroup && coachOffersGroup))
        {
            if (athleteWantsOneOnOne)
            {
                reasons.Add("Offers 1-on-1 training sessions");
            }
            else
            {
                reasons.Add("Offers group training sessions");
            }
            return maxPoints;
        }

        // Coach offers both
        if (coachOffersOneOnOne && coachOffersGroup)
        {
            return maxPoints * 0.8;
        }

        // Some overlap
        if ((athleteWantsOneOnOne && coachOffersOneOnOne) || (athleteWantsGroup && coachOffersGroup))
        {
            return maxPoints * 0.6;
        }

        return maxPoints * 0.3;
    }

    private double CalculateCommunicationScore(
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        List<string> reasons)
    {
        const double maxPoints = 5.0;

        if (string.IsNullOrEmpty(athleteProfile.PreferredCommunicationStyle) ||
            string.IsNullOrEmpty(coachProfile.CommunicationStyle))
        {
            return maxPoints * 0.5;
        }

        // Exact match
        if (athleteProfile.PreferredCommunicationStyle.Equals(coachProfile.CommunicationStyle, StringComparison.OrdinalIgnoreCase))
        {
            return maxPoints;
        }

        // Compatible communication styles
        var compatibleStyles = new Dictionary<string, List<string>>
        {
            { "Direct", new List<string> { "Straightforward", "Clear", "Honest" } },
            { "Supportive", new List<string> { "Encouraging", "Positive", "Motivational" } },
            { "Detailed", new List<string> { "Thorough", "Analytical", "Comprehensive" } }
        };

        foreach (var pair in compatibleStyles)
        {
            if ((athleteProfile.PreferredCommunicationStyle.Contains(pair.Key, StringComparison.OrdinalIgnoreCase) &&
                 pair.Value.Any(s => coachProfile.CommunicationStyle.Contains(s, StringComparison.OrdinalIgnoreCase))) ||
                (coachProfile.CommunicationStyle.Contains(pair.Key, StringComparison.OrdinalIgnoreCase) &&
                 pair.Value.Any(s => athleteProfile.PreferredCommunicationStyle.Contains(s, StringComparison.OrdinalIgnoreCase))))
            {
                return maxPoints * 0.7;
            }
        }

        return maxPoints * 0.4;
    }
}
