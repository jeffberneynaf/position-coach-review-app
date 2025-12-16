using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateReviewRequest
{
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    
    [Required]
    public string Comment { get; set; } = string.Empty;
    
    [Required]
    public int CoachId { get; set; }
}
