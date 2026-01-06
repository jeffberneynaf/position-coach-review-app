using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Email verification fields
    public bool IsEmailVerified { get; set; } = false;
    
    public string? EmailVerificationToken { get; set; }
    
    public DateTime? EmailVerificationTokenExpiry { get; set; }
    
    // Navigation property for submitted reviews
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    
    public AthleteProfile? AthleteProfile { get; set; }
}
