using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models.DTOs;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegisterUserRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$", 
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)")]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    // Athlete profile fields (optional - profile created only if AthleteName is provided)
    public string? AthleteName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Position { get; set; }
    public string? SkillLevel { get; set; }
    public string? ZipCode { get; set; }
    public string? TrainingIntensity { get; set; }
    public string? PreferredSchedule { get; set; }
    public string? SessionDuration { get; set; }
    public int? SessionsPerWeek { get; set; }
    public string? PreferredCoachingStyle { get; set; }
    public string? PreferredCommunicationStyle { get; set; }
    public bool PreferGroupTraining { get; set; }
    public bool PreferOneOnOne { get; set; }
    public bool WillingToTravel { get; set; }
    public List<string>? PrimaryGoals { get; set; }
    public List<string>? AreasForImprovement { get; set; }
    public string? SpecialNeeds { get; set; }
    public decimal? MaxBudgetPerSession { get; set; }
    public int? MaxTravelDistanceMiles { get; set; }
}

public class RegisterCoachRequest
{
    // Existing basic fields
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$", 
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)")]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    [Compare("Password", ErrorMessage = "Passwords do not match")]
    public string ConfirmPassword { get; set; } = string.Empty;
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    public string ZipCode { get; set; } = string.Empty;
    
    public string Bio { get; set; } = string.Empty;
    
    public string Specialization { get; set; } = string.Empty;
    
    public string PhoneNumber { get; set; } = string.Empty;
    
    public int YearsOfExperience { get; set; }
    
    // Matchmaking fields (optional - can be provided during extended signup)
    public string? CoachingStyle { get; set; }
    public string? CommunicationStyle { get; set; }
    public string? TrainingPhilosophy { get; set; }
    public List<string>? Specialties { get; set; }
    public List<string>? PositionsCoached { get; set; }
    public List<string>? SkillLevelsAccepted { get; set; }
    public bool AcceptsGroupTraining { get; set; }
    public bool AcceptsOneOnOne { get; set; } = true;
    public List<string>? AvailableDays { get; set; }
    public List<string>? AvailableTimeSlots { get; set; }
    public decimal SessionPrice { get; set; }
    public bool OffersVirtualSessions { get; set; }
    public bool OffersInPersonSessions { get; set; } = true;
    public List<string>? Certifications { get; set; }
    public int MinAgeAccepted { get; set; } = 6;
    public int MaxAgeAccepted { get; set; } = 100;
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string UserType { get; set; } = string.Empty; // "User" or "Coach"
}

public class ChangePasswordRequest
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;
    
    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$", 
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)")]
    public string NewPassword { get; set; } = string.Empty;
    
    [Required]
    [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
    public string ConfirmNewPassword { get; set; } = string.Empty;
}

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;
    
    [Required]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$", 
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)")]
    public string NewPassword { get; set; } = string.Empty;
    
    [Required]
    [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
    public string ConfirmNewPassword { get; set; } = string.Empty;
}
