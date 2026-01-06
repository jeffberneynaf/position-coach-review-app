using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models.DTOs;

// Athlete Profile DTOs
public class AthleteProfileDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string AthleteName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public int Age { get; set; }
    public string Position { get; set; } = string.Empty;
    public string SkillLevel { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string TrainingIntensity { get; set; } = string.Empty;
    public string PreferredSchedule { get; set; } = string.Empty;
    public int SessionsPerWeek { get; set; }
    public string SessionDuration { get; set; } = string.Empty;
    public string PreferredCoachingStyle { get; set; } = string.Empty;
    public string PreferredCommunicationStyle { get; set; } = string.Empty;
    public bool PreferGroupTraining { get; set; }
    public bool PreferOneOnOne { get; set; }
    public List<string> PrimaryGoals { get; set; } = new();
    public List<string> AreasForImprovement { get; set; } = new();
    public string SpecialNeeds { get; set; } = string.Empty;
    public decimal MaxBudgetPerSession { get; set; }
    public int MaxTravelDistanceMiles { get; set; }
    public bool WillingToTravel { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateAthleteProfileRequest
{
    [Required]
    public string AthleteName { get; set; } = string.Empty;
    
    [Required]
    public DateTime DateOfBirth { get; set; }
    
    [Required]
    public string Position { get; set; } = string.Empty;
    
    [Required]
    public string SkillLevel { get; set; } = string.Empty;
    
    [Required]
    public string ZipCode { get; set; } = string.Empty;
    
    public string TrainingIntensity { get; set; } = string.Empty;
    public string PreferredSchedule { get; set; } = string.Empty;
    public int SessionsPerWeek { get; set; }
    public string SessionDuration { get; set; } = string.Empty;
    public string PreferredCoachingStyle { get; set; } = string.Empty;
    public string PreferredCommunicationStyle { get; set; } = string.Empty;
    public bool PreferGroupTraining { get; set; }
    public bool PreferOneOnOne { get; set; }
    public List<string> PrimaryGoals { get; set; } = new();
    public List<string> AreasForImprovement { get; set; } = new();
    public string SpecialNeeds { get; set; } = string.Empty;
    public decimal MaxBudgetPerSession { get; set; }
    public int MaxTravelDistanceMiles { get; set; }
    public bool WillingToTravel { get; set; }
}

public class UpdateAthleteProfileRequest
{
    [Required]
    public string AthleteName { get; set; } = string.Empty;
    
    [Required]
    public DateTime DateOfBirth { get; set; }
    
    [Required]
    public string Position { get; set; } = string.Empty;
    
    [Required]
    public string SkillLevel { get; set; } = string.Empty;
    
    [Required]
    public string ZipCode { get; set; } = string.Empty;
    
    public string TrainingIntensity { get; set; } = string.Empty;
    public string PreferredSchedule { get; set; } = string.Empty;
    public int SessionsPerWeek { get; set; }
    public string SessionDuration { get; set; } = string.Empty;
    public string PreferredCoachingStyle { get; set; } = string.Empty;
    public string PreferredCommunicationStyle { get; set; } = string.Empty;
    public bool PreferGroupTraining { get; set; }
    public bool PreferOneOnOne { get; set; }
    public List<string> PrimaryGoals { get; set; } = new();
    public List<string> AreasForImprovement { get; set; } = new();
    public string SpecialNeeds { get; set; } = string.Empty;
    public decimal MaxBudgetPerSession { get; set; }
    public int MaxTravelDistanceMiles { get; set; }
    public bool WillingToTravel { get; set; }
}

// Coach Match Profile DTOs
public class CoachMatchProfileDto
{
    public int Id { get; set; }
    public int CoachId { get; set; }
    public string CoachFirstName { get; set; } = string.Empty;
    public string CoachLastName { get; set; } = string.Empty;
    public string CoachEmail { get; set; } = string.Empty;
    public string CoachingStyle { get; set; } = string.Empty;
    public string CommunicationStyle { get; set; } = string.Empty;
    public string TrainingPhilosophy { get; set; } = string.Empty;
    public List<string> Specialties { get; set; } = new();
    public string PositionsCoached { get; set; } = string.Empty;
    public string SkillLevelsAccepted { get; set; } = string.Empty;
    public bool AcceptsGroupTraining { get; set; }
    public bool AcceptsOneOnOne { get; set; }
    public List<string> AvailableDays { get; set; } = new();
    public List<string> AvailableTimeSlots { get; set; } = new();
    public int MaxNewClientsPerMonth { get; set; }
    public decimal SessionPriceMin { get; set; }
    public decimal SessionPriceMax { get; set; }
    public int TravelRadiusMiles { get; set; }
    public bool OffersVirtualSessions { get; set; }
    public bool OffersInPersonSessions { get; set; }
    public List<string> SuccessStories { get; set; } = new();
    public int YearsCoachingPosition { get; set; }
    public List<string> Certifications { get; set; } = new();
    public List<string> PreferredAthleteTraits { get; set; } = new();
    public int MinAgeAccepted { get; set; }
    public int MaxAgeAccepted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateCoachMatchProfileRequest
{
    public string CoachingStyle { get; set; } = string.Empty;
    public string CommunicationStyle { get; set; } = string.Empty;
    public string TrainingPhilosophy { get; set; } = string.Empty;
    public List<string> Specialties { get; set; } = new();
    public string PositionsCoached { get; set; } = string.Empty;
    public string SkillLevelsAccepted { get; set; } = string.Empty;
    public bool AcceptsGroupTraining { get; set; }
    public bool AcceptsOneOnOne { get; set; }
    public List<string> AvailableDays { get; set; } = new();
    public List<string> AvailableTimeSlots { get; set; } = new();
    public int MaxNewClientsPerMonth { get; set; }
    public decimal SessionPriceMin { get; set; }
    public decimal SessionPriceMax { get; set; }
    public int TravelRadiusMiles { get; set; }
    public bool OffersVirtualSessions { get; set; }
    public bool OffersInPersonSessions { get; set; }
    public List<string> SuccessStories { get; set; } = new();
    public int YearsCoachingPosition { get; set; }
    public List<string> Certifications { get; set; } = new();
    public List<string> PreferredAthleteTraits { get; set; } = new();
    public int MinAgeAccepted { get; set; }
    public int MaxAgeAccepted { get; set; }
}

public class UpdateCoachMatchProfileRequest
{
    public string CoachingStyle { get; set; } = string.Empty;
    public string CommunicationStyle { get; set; } = string.Empty;
    public string TrainingPhilosophy { get; set; } = string.Empty;
    public List<string> Specialties { get; set; } = new();
    public string PositionsCoached { get; set; } = string.Empty;
    public string SkillLevelsAccepted { get; set; } = string.Empty;
    public bool AcceptsGroupTraining { get; set; }
    public bool AcceptsOneOnOne { get; set; }
    public List<string> AvailableDays { get; set; } = new();
    public List<string> AvailableTimeSlots { get; set; } = new();
    public int MaxNewClientsPerMonth { get; set; }
    public decimal SessionPriceMin { get; set; }
    public decimal SessionPriceMax { get; set; }
    public int TravelRadiusMiles { get; set; }
    public bool OffersVirtualSessions { get; set; }
    public bool OffersInPersonSessions { get; set; }
    public List<string> SuccessStories { get; set; } = new();
    public int YearsCoachingPosition { get; set; }
    public List<string> Certifications { get; set; } = new();
    public List<string> PreferredAthleteTraits { get; set; } = new();
    public int MinAgeAccepted { get; set; }
    public int MaxAgeAccepted { get; set; }
}

// Match DTOs
public class MatchDto
{
    public int Id { get; set; }
    public int AthleteProfileId { get; set; }
    public AthleteProfileDto? AthleteProfile { get; set; }
    public int CoachMatchProfileId { get; set; }
    public CoachMatchProfileDto? CoachMatchProfile { get; set; }
    public double MatchScore { get; set; }
    public List<string> MatchReasons { get; set; } = new();
    public MatchScoreBreakdown? ScoreBreakdown { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? AthleteInterestedAt { get; set; }
    public DateTime? CoachInterestedAt { get; set; }
    public DateTime? ConnectedAt { get; set; }
    public string AthleteNotes { get; set; } = string.Empty;
    public string CoachNotes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public List<MatchInteractionDto> Interactions { get; set; } = new();
}

public class MatchScoreBreakdown
{
    public double LocationScore { get; set; }
    public double SpecializationScore { get; set; }
    public double CoachingStyleScore { get; set; }
    public double ScheduleScore { get; set; }
    public double SkillLevelScore { get; set; }
    public double BudgetScore { get; set; }
    public double TrainingFormatScore { get; set; }
    public double CommunicationScore { get; set; }
    public double TotalScore { get; set; }
}

public class MatchInteractionDto
{
    public int Id { get; set; }
    public int MatchId { get; set; }
    public string ActorType { get; set; } = string.Empty;
    public int ActorId { get; set; }
    public string ActionType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class FindMatchesRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Position { get; set; }
    public string? SkillLevel { get; set; }
    public decimal? MaxPrice { get; set; }
    public int? MaxDistance { get; set; }
    public bool? OffersVirtual { get; set; }
    public bool? OffersInPerson { get; set; }
    public string? CoachingStyle { get; set; }
    public double MinMatchScore { get; set; } = 0;
}

public class MatchInteractionRequest
{
    [Required]
    public string ActionType { get; set; } = string.Empty;
    
    public string Message { get; set; } = string.Empty;
}

public class UpdateMatchStatusRequest
{
    [Required]
    public string Status { get; set; } = string.Empty;
    
    public string Notes { get; set; } = string.Empty;
}

public class MatchmakingStatsDto
{
    public int TotalMatches { get; set; }
    public int SuggestedMatches { get; set; }
    public int InterestedMatches { get; set; }
    public int ConnectedMatches { get; set; }
    public double AverageMatchScore { get; set; }
    public int TotalInteractions { get; set; }
}

public class PaginatedMatchesResponse
{
    public List<MatchDto> Matches { get; set; } = new();
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalPages { get; set; }
}
