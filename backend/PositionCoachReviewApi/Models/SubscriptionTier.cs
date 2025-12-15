using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class SubscriptionTier
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty; // Free, Basic, Premium
    
    public decimal Price { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    public int MaxClients { get; set; } // Maximum number of clients allowed
    
    public bool FeaturedListing { get; set; } // Whether coach appears in featured listings
    
    public bool AnalyticsAccess { get; set; } // Whether coach has access to analytics
    
    // Navigation property
    public ICollection<Coach> Coaches { get; set; } = new List<Coach>();
}
