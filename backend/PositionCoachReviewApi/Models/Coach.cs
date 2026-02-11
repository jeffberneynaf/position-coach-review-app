using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class Coach
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
    
    public string Bio { get; set; } = string.Empty;
    
    public string Specialization { get; set; } = string.Empty;
    
    [Required]
    public string ZipCode { get; set; } = string.Empty;
    
    public double? Latitude { get; set; }
    
    public double? Longitude { get; set; }
    
    public string PhoneNumber { get; set; } = string.Empty;
    
    public int YearsOfExperience { get; set; }
    
    public string? ProfilePhotoUrl { get; set; }
    
    // Subscription tier (Free, Basic, Premium)
    public int SubscriptionTierId { get; set; }
    public SubscriptionTier? SubscriptionTier { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Email verification fields
    public bool IsEmailVerified { get; set; } = false;
    
    public string? EmailVerificationToken { get; set; }
    
    public DateTime? EmailVerificationTokenExpiry { get; set; }
    
    // Password reset fields
    public string? PasswordResetToken { get; set; }
    
    public DateTime? PasswordResetTokenExpiry { get; set; }
    
    // Navigation properties
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Client> Clients { get; set; } = new List<Client>();
    public CoachMatchProfile? MatchProfile { get; set; }
}
