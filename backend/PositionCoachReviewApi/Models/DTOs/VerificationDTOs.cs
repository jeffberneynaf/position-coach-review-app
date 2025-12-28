using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models.DTOs;

public class VerifyEmailRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;
    
    [Required]
    public string UserType { get; set; } = string.Empty; // "User" or "Coach"
}

public class ResendVerificationRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string UserType { get; set; } = string.Empty; // "User" or "Coach"
}
