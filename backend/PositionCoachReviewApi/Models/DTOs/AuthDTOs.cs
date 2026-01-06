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
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
}

public class RegisterCoachRequest
{
    // Existing basic fields
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
    
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
    public int MaxNewClientsPerMonth { get; set; } = 5;
    public decimal SessionPriceMin { get; set; }
    public decimal SessionPriceMax { get; set; }
    public int TravelRadiusMiles { get; set; } = 25;
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
