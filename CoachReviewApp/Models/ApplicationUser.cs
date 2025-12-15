using Microsoft.AspNetCore.Identity;

namespace CoachReviewApp.Models;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public Coach? Coach { get; set; }
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
