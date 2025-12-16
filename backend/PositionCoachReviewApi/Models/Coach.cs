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
    
    public string PhoneNumber { get; set; } = string.Empty;
    
    public int YearsOfExperience { get; set; }
    
    // Subscription tier (Free, Basic, Premium)
    public int SubscriptionTierId { get; set; }
    public SubscriptionTier? SubscriptionTier { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Client> Clients { get; set; } = new List<Client>();
}
