using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class MatchModel
{
    public int Id { get; set; }
    
    [Required]
    public int AthleteProfileId { get; set; }
    public AthleteProfile? AthleteProfile { get; set; }
    
    [Required]
    public int CoachMatchProfileId { get; set; }
    public CoachMatchProfile? CoachMatchProfile { get; set; }
    
    public double MatchScore { get; set; }
    public string MatchReasonsJson { get; set; } = string.Empty;
    public string ScoreBreakdownJson { get; set; } = string.Empty;
    public string Status { get; set; } = "Suggested";
    public DateTime? AthleteInterestedAt { get; set; }
    public DateTime? CoachInterestedAt { get; set; }
    public DateTime? ConnectedAt { get; set; }
    public string AthleteNotes { get; set; } = string.Empty;
    public string CoachNotes { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    
    public ICollection<MatchInteraction> Interactions { get; set; } = new List<MatchInteraction>();
}
