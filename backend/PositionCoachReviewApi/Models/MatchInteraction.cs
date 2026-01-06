using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class MatchInteraction
{
    public int Id { get; set; }
    
    [Required]
    public int MatchId { get; set; }
    public MatchModel? Match { get; set; }
    
    [Required]
    public string ActorType { get; set; } = string.Empty;
    
    [Required]
    public int ActorId { get; set; }
    
    [Required]
    public string ActionType { get; set; } = string.Empty;
    
    public string Message { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
