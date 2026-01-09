using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Data;
using PositionCoachReviewApi.Models;
using PositionCoachReviewApi.Models.DTOs;
using PositionCoachReviewApi.Services;
using BCrypt.Net;
using System.Security.Cryptography;
using System.Text.Json;

namespace PositionCoachReviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IZipCodeService _zipCodeService;
    private readonly IEmailService _emailService;
    private readonly IPhotoService _photoService;

    public AuthController(ApplicationDbContext context, IJwtService jwtService, IZipCodeService zipCodeService, IEmailService emailService, IPhotoService photoService)
    {
        _context = context;
        _jwtService = jwtService;
        _zipCodeService = zipCodeService;
        _emailService = emailService;
        _photoService = photoService;
    }

    private string GenerateVerificationToken()
    {
        var randomBytes = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
    }

    [HttpPost("register/user")]
    public async Task<ActionResult> RegisterUser([FromBody] RegisterUserRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        var verificationToken = GenerateVerificationToken();

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            IsEmailVerified = false,
            EmailVerificationToken = verificationToken,
            EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Create AthleteProfile if athlete data is provided
        if (!string.IsNullOrEmpty(request.AthleteName))
        {
            // Require DateOfBirth when creating athlete profile
            if (!request.DateOfBirth.HasValue)
            {
                return BadRequest(new { message = "Date of birth is required when creating an athlete profile" });
            }

            var athleteProfile = new AthleteProfile
            {
                UserId = user.Id,
                AthleteName = request.AthleteName,
                DateOfBirth = request.DateOfBirth.Value,
                Position = request.Position ?? string.Empty,
                SkillLevel = request.SkillLevel ?? string.Empty,
                ZipCode = request.ZipCode ?? string.Empty,
                TrainingIntensity = request.TrainingIntensity ?? string.Empty,
                PreferredSchedule = request.PreferredSchedule ?? string.Empty,
                SessionsPerWeek = request.SessionsPerWeek ?? 0,
                SessionDuration = request.SessionDuration ?? string.Empty,
                PreferredCoachingStyle = request.PreferredCoachingStyle ?? string.Empty,
                PreferredCommunicationStyle = request.PreferredCommunicationStyle ?? string.Empty,
                PreferGroupTraining = request.PreferGroupTraining,
                PreferOneOnOne = request.PreferOneOnOne,
                WillingToTravel = request.WillingToTravel,
                PrimaryGoalsJson = JsonSerializer.Serialize(request.PrimaryGoals ?? new List<string>()),
                AreasForImprovementJson = JsonSerializer.Serialize(request.AreasForImprovement ?? new List<string>()),
                SpecialNeeds = request.SpecialNeeds ?? string.Empty,
                MaxBudgetPerSession = request.MaxBudgetPerSession ?? 0,
                MaxTravelDistanceMiles = request.MaxTravelDistanceMiles ?? 0
            };
            
            _context.AthleteProfiles.Add(athleteProfile);
            await _context.SaveChangesAsync();
        }

        // Send verification email
        await _emailService.SendVerificationEmailAsync(user.Email, user.FirstName, verificationToken, "User");

        return Ok(new { message = "Registration successful! Please check your email to verify your account." });
    }

    [HttpPost("register/coach")]
    public async Task<ActionResult> RegisterCoach([FromBody] RegisterCoachRequest request)
    {
        if (await _context.Coaches.AnyAsync(c => c.Email == request.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        // Get coordinates for the zipcode
        var (latitude, longitude) = await _zipCodeService.GetCoordinatesAsync(request.ZipCode);

        var verificationToken = GenerateVerificationToken();

        var coach = new Coach
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Bio = request.Bio,
            Specialization = request.Specialization,
            ZipCode = request.ZipCode,
            PhoneNumber = request.PhoneNumber,
            YearsOfExperience = request.YearsOfExperience,
            SubscriptionTierId = 1, // Default to Free tier
            Latitude = latitude,
            Longitude = longitude,
            IsEmailVerified = false,
            EmailVerificationToken = verificationToken,
            EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24)
        };

        _context.Coaches.Add(coach);
        await _context.SaveChangesAsync();

        // Create CoachMatchProfile if matchmaking data is provided
        if (!string.IsNullOrEmpty(request.CoachingStyle))
        {
            var matchProfile = new CoachMatchProfile
            {
                CoachId = coach.Id,
                CoachingStyle = request.CoachingStyle ?? string.Empty,
                CommunicationStyle = request.CommunicationStyle ?? string.Empty,
                TrainingPhilosophy = request.TrainingPhilosophy ?? string.Empty,
                SpecialtiesJson = request.Specialties != null ? JsonSerializer.Serialize(request.Specialties) : "[]",
                PositionsCoached = request.PositionsCoached != null ? JsonSerializer.Serialize(request.PositionsCoached) : "[]",
                SkillLevelsAccepted = request.SkillLevelsAccepted != null ? JsonSerializer.Serialize(request.SkillLevelsAccepted) : "[]",
                AcceptsGroupTraining = request.AcceptsGroupTraining,
                AcceptsOneOnOne = request.AcceptsOneOnOne,
                AvailableDaysJson = request.AvailableDays != null ? JsonSerializer.Serialize(request.AvailableDays) : "[]",
                AvailableTimeSlotsJson = request.AvailableTimeSlots != null ? JsonSerializer.Serialize(request.AvailableTimeSlots) : "[]",
                MaxNewClientsPerMonth = request.MaxNewClientsPerMonth,
                SessionPriceMin = request.SessionPriceMin,
                SessionPriceMax = request.SessionPriceMax,
                TravelRadiusMiles = request.TravelRadiusMiles,
                OffersVirtualSessions = request.OffersVirtualSessions,
                OffersInPersonSessions = request.OffersInPersonSessions,
                YearsCoachingPosition = request.YearsOfExperience,
                CertificationsJson = request.Certifications != null ? JsonSerializer.Serialize(request.Certifications) : "[]",
                MinAgeAccepted = request.MinAgeAccepted,
                MaxAgeAccepted = request.MaxAgeAccepted
            };

            _context.CoachMatchProfiles.Add(matchProfile);
            await _context.SaveChangesAsync();
        }

        // Send verification email
        await _emailService.SendVerificationEmailAsync(coach.Email, coach.FirstName, verificationToken, "Coach");

        return Ok(new { message = "Registration successful! Please check your email to verify your account.", coachId = coach.Id });
    }

    [HttpPost("login/user")]
    public async Task<ActionResult<AuthResponse>> LoginUser([FromBody] LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        if (!user.IsEmailVerified)
        {
            return Unauthorized(new { message = "Please verify your email before logging in", emailNotVerified = true });
        }

        var token = _jwtService.GenerateToken(user.Id, user.Email, "User");

        return Ok(new AuthResponse
        {
            Token = token,
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserType = "User"
        });
    }

    [HttpPost("login/coach")]
    public async Task<ActionResult<AuthResponse>> LoginCoach([FromBody] LoginRequest request)
    {
        var coach = await _context.Coaches.FirstOrDefaultAsync(c => c.Email == request.Email);
        
        if (coach == null || !BCrypt.Net.BCrypt.Verify(request.Password, coach.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        if (!coach.IsEmailVerified)
        {
            return Unauthorized(new { message = "Please verify your email before logging in", emailNotVerified = true });
        }

        var token = _jwtService.GenerateToken(coach.Id, coach.Email, "Coach");

        return Ok(new AuthResponse
        {
            Token = token,
            Id = coach.Id,
            Email = coach.Email,
            FirstName = coach.FirstName,
            LastName = coach.LastName,
            UserType = "Coach"
        });
    }

    [HttpPost("verify-email")]
    public async Task<ActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        if (request.UserType == "User")
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailVerificationToken == request.Token);
            
            if (user == null)
            {
                return BadRequest(new { message = "Invalid verification token" });
            }

            if (user.EmailVerificationTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Verification token has expired" });
            }

            user.IsEmailVerified = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpiry = null;
            await _context.SaveChangesAsync();

            // Send welcome email
            await _emailService.SendWelcomeEmailAsync(user.Email, user.FirstName);

            return Ok(new { message = "Email verified successfully! You can now log in." });
        }
        else if (request.UserType == "Coach")
        {
            var coach = await _context.Coaches.FirstOrDefaultAsync(c => c.EmailVerificationToken == request.Token);
            
            if (coach == null)
            {
                return BadRequest(new { message = "Invalid verification token" });
            }

            if (coach.EmailVerificationTokenExpiry < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Verification token has expired" });
            }

            coach.IsEmailVerified = true;
            coach.EmailVerificationToken = null;
            coach.EmailVerificationTokenExpiry = null;
            await _context.SaveChangesAsync();

            // Send welcome email
            await _emailService.SendWelcomeEmailAsync(coach.Email, coach.FirstName);

            return Ok(new { message = "Email verified successfully! You can now log in." });
        }

        return BadRequest(new { message = "Invalid user type" });
    }

    [HttpPost("resend-verification")]
    public async Task<ActionResult> ResendVerification([FromBody] ResendVerificationRequest request)
    {
        if (request.UserType == "User")
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }

            if (user.IsEmailVerified)
            {
                return BadRequest(new { message = "Email is already verified" });
            }

            var verificationToken = GenerateVerificationToken();
            user.EmailVerificationToken = verificationToken;
            user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
            await _context.SaveChangesAsync();

            // Send verification email
            await _emailService.SendVerificationEmailAsync(user.Email, user.FirstName, verificationToken, "User");

            return Ok(new { message = "Verification email sent! Please check your inbox." });
        }
        else if (request.UserType == "Coach")
        {
            var coach = await _context.Coaches.FirstOrDefaultAsync(c => c.Email == request.Email);
            
            if (coach == null)
            {
                return BadRequest(new { message = "Coach not found" });
            }

            if (coach.IsEmailVerified)
            {
                return BadRequest(new { message = "Email is already verified" });
            }

            var verificationToken = GenerateVerificationToken();
            coach.EmailVerificationToken = verificationToken;
            coach.EmailVerificationTokenExpiry = DateTime.UtcNow.AddHours(24);
            await _context.SaveChangesAsync();

            // Send verification email
            await _emailService.SendVerificationEmailAsync(coach.Email, coach.FirstName, verificationToken, "Coach");

            return Ok(new { message = "Verification email sent! Please check your inbox." });
        }

        return BadRequest(new { message = "Invalid user type" });
    }

    [HttpPost("upload-coach-photo/{coachId}")]
    public async Task<ActionResult> UploadCoachPhoto(int coachId, IFormFile photo)
    {
        // Validate that coach exists
        var coach = await _context.Coaches.FindAsync(coachId);
        if (coach == null)
        {
            return NotFound(new { message = "Coach not found" });
        }

        // Validate photo
        if (!await _photoService.ValidatePhotoAsync(photo))
        {
            return BadRequest(new { message = "Invalid photo. Must be JPEG, PNG, or WebP, max 5MB, minimum 200x200 pixels." });
        }

        try
        {
            // Delete old photo if exists
            if (!string.IsNullOrEmpty(coach.PhotoUrl))
            {
                await _photoService.DeleteCoachPhotoAsync(coachId);
            }

            // Save new photo
            var (photoUrl, thumbnailUrl) = await _photoService.SaveCoachPhotoAsync(photo, coachId);
            
            // Update coach record
            coach.PhotoUrl = photoUrl;
            coach.ThumbnailUrl = thumbnailUrl;
            coach.PhotoUploadedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();

            return Ok(new { photoUrl, thumbnailUrl, message = "Photo uploaded successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to upload photo", error = ex.Message });
        }
    }
}
