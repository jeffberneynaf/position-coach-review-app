using System.ComponentModel.DataAnnotations;

namespace CoachReviewApp.ViewModels;

public class CoachProfileViewModel
{
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
    [Display(Name = "Zip Code")]
    public string ZipCode { get; set; } = string.Empty;

    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [StringLength(50)]
    public string State { get; set; } = string.Empty;

    [Phone]
    [Display(Name = "Phone Number")]
    public string? PhoneNumber { get; set; }

    [Display(Name = "Years of Experience")]
    public int YearsOfExperience { get; set; }

    [Required]
    [Display(Name = "Subscription Tier")]
    public int SubscriptionTierId { get; set; }
}
