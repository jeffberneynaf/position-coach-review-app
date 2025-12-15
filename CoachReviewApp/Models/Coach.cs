using System.ComponentModel.DataAnnotations;

namespace CoachReviewApp.Models;

public class Coach
{
    public int Id { get; set; }
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(500)]
    public string Bio { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string Specialization { get; set; } = string.Empty;
    
    [Required]
    [StringLength(10)]
    public string ZipCode { get; set; } = string.Empty;
    
    [StringLength(100)]
    public string City { get; set; } = string.Empty;
    
    [StringLength(50)]
    public string State { get; set; } = string.Empty;
    
    [Phone]
    public string? PhoneNumber { get; set; }
    
    public int YearsOfExperience { get; set; }
    
    public int SubscriptionTierId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public SubscriptionTier SubscriptionTier { get; set; } = null!;
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    
    // Computed properties
    public double AverageRating => Reviews.Any() ? Reviews.Average(r => r.Rating) : 0;
    public int TotalReviews => Reviews.Count;
}
