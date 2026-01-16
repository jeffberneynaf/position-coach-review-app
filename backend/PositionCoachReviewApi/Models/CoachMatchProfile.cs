using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class CoachMatchProfile
{
    public int Id { get; set; }
    
    [Required]
    public int CoachId { get; set; }
    public Coach? Coach { get; set; }
    
    public string CoachingStyle { get; set; } = string.Empty;
    public string CommunicationStyle { get; set; } = string.Empty;
    public string TrainingPhilosophy { get; set; } = string.Empty;
    public string SpecialtiesJson { get; set; } = string.Empty;
    public string PositionsCoached { get; set; } = string.Empty;
    public string SkillLevelsAccepted { get; set; } = string.Empty;
    public bool AcceptsGroupTraining { get; set; }
    public bool AcceptsOneOnOne { get; set; }
    public string AvailableDaysJson { get; set; } = string.Empty;
    public string AvailableTimeSlotsJson { get; set; } = string.Empty;
    public decimal SessionPrice { get; set; }
    public bool OffersVirtualSessions { get; set; }
    public bool OffersInPersonSessions { get; set; }
    public string SuccessStoriesJson { get; set; } = string.Empty;
    public int YearsCoachingPosition { get; set; }
    public string CertificationsJson { get; set; } = string.Empty;
    public string PreferredAthleteTraitsJson { get; set; } = string.Empty;
    public int MinAgeAccepted { get; set; }
    public int MaxAgeAccepted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<MatchModel> Matches { get; set; } = new List<MatchModel>();
}
