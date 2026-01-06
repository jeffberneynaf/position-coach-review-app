using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class MatchPreference
{
    public int Id { get; set; }
    
    [Required]
    public int AthleteProfileId { get; set; }
    public AthleteProfile? AthleteProfile { get; set; }
    
    [Required]
    public string PreferenceName { get; set; } = string.Empty;
    
    public string FiltersJson { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
