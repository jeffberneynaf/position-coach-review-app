using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class Review
{
    public int Id { get; set; }
    
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    
    [Required]
    public string Comment { get; set; } = string.Empty;
    
    // Foreign keys
    public int UserId { get; set; }
    public User? User { get; set; }
    
    public int CoachId { get; set; }
    public Coach? Coach { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
