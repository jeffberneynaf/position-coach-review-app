using System.ComponentModel.DataAnnotations;

namespace CoachReviewApp.Models;

public class SubscriptionTier
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    [Range(0, 10000)]
    public decimal Price { get; set; }
    
    public int MaxReviews { get; set; }
    
    public bool CanViewClientContacts { get; set; }
    
    public bool FeaturedListing { get; set; }
    
    // Navigation properties
    public ICollection<Coach> Coaches { get; set; } = new List<Coach>();
}
