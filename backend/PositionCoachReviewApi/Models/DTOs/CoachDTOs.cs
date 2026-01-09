namespace PositionCoachReviewApi.Models.DTOs;

public class CoachProfileDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public string? ProfilePhotoUrl { get; set; }
    public string SubscriptionTierName { get; set; } = string.Empty;
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public List<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();
}

public class UpdateCoachProfileRequest
{
    public string Bio { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
}
