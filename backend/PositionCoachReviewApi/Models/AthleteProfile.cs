using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class AthleteProfile
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    public User? User { get; set; }
    
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
    public string PrimaryGoalsJson { get; set; } = string.Empty;
    public string AreasForImprovementJson { get; set; } = string.Empty;
    public string SpecialNeeds { get; set; } = string.Empty;
    public decimal MaxBudgetPerSession { get; set; }
    public int MaxTravelDistanceMiles { get; set; }
    public bool WillingToTravel { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<MatchModel> Matches { get; set; } = new List<MatchModel>();
    public ICollection<MatchPreference> MatchPreferences { get; set; } = new List<MatchPreference>();
}
