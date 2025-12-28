using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Data;
using PositionCoachReviewApi.Models.DTOs;
using PositionCoachReviewApi.Services;
using PositionCoachReviewApi.Utils;
using System.Security.Claims;

namespace PositionCoachReviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoachesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IZipCodeService _zipCodeService;

    public CoachesController(ApplicationDbContext context, IZipCodeService zipCodeService)
    {
        _context = context;
        _zipCodeService = zipCodeService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CoachProfileDto>>> GetCoaches()
    {
        var coaches = await _context.Coaches
            .Include(c => c.SubscriptionTier)
            .Include(c => c.Reviews)
            .ThenInclude(r => r.User)
            .Select(c => new CoachProfileDto
            {
                Id = c.Id,
                Email = c.Email,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Bio = c.Bio,
                Specialization = c.Specialization,
                ZipCode = c.ZipCode,
                PhoneNumber = c.PhoneNumber,
                YearsOfExperience = c.YearsOfExperience,
                SubscriptionTierName = c.SubscriptionTier != null ? c.SubscriptionTier.Name : "Free",
                AverageRating = c.Reviews.Any() ? c.Reviews.Average(r => r.Rating) : 0,
                ReviewCount = c.Reviews.Count,
                Reviews = c.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Anonymous",
                    CreatedAt = r.CreatedAt
                }).ToList()
            })
            .ToListAsync();

        return Ok(coaches);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CoachProfileDto>> GetCoach(int id)
    {
        var coach = await _context.Coaches
            .Include(c => c.SubscriptionTier)
            .Include(c => c.Reviews)
            .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (coach == null)
        {
            return NotFound();
        }

        var coachDto = new CoachProfileDto
        {
            Id = coach.Id,
            Email = coach.Email,
            FirstName = coach.FirstName,
            LastName = coach.LastName,
            Bio = coach.Bio,
            Specialization = coach.Specialization,
            ZipCode = coach.ZipCode,
            PhoneNumber = coach.PhoneNumber,
            YearsOfExperience = coach.YearsOfExperience,
            SubscriptionTierName = coach.SubscriptionTier?.Name ?? "Free",
            AverageRating = coach.Reviews.Any() ? coach.Reviews.Average(r => r.Rating) : 0,
            ReviewCount = coach.Reviews.Count,
            Reviews = coach.Reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                Rating = r.Rating,
                Comment = r.Comment,
                UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Anonymous",
                CreatedAt = r.CreatedAt
            }).ToList()
        };

        return Ok(coachDto);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<CoachProfileDto>>> SearchCoachesByZipCode(
        [FromQuery] string zipCode, 
        [FromQuery] double? radius)
    {
        if (string.IsNullOrWhiteSpace(zipCode))
        {
            return BadRequest(new { message = "Zip code is required" });
        }

        // Default radius to 10 miles if not provided
        var searchRadius = radius ?? 10.0;

        // Get coordinates for the search zipcode
        var (searchLat, searchLon) = await _zipCodeService.GetCoordinatesAsync(zipCode);

        if (!searchLat.HasValue || !searchLon.HasValue)
        {
            // Fallback to prefix search if zipcode coordinates not found
            var coaches = await _context.Coaches
                .Include(c => c.SubscriptionTier)
                .Include(c => c.Reviews)
                .ThenInclude(r => r.User)
                .Where(c => c.ZipCode.StartsWith(zipCode.Substring(0, Math.Min(3, zipCode.Length))))
                .Select(c => new CoachProfileDto
                {
                    Id = c.Id,
                    Email = c.Email,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Bio = c.Bio,
                    Specialization = c.Specialization,
                    ZipCode = c.ZipCode,
                    PhoneNumber = c.PhoneNumber,
                    YearsOfExperience = c.YearsOfExperience,
                    SubscriptionTierName = c.SubscriptionTier != null ? c.SubscriptionTier.Name : "Free",
                    AverageRating = c.Reviews.Any() ? c.Reviews.Average(r => r.Rating) : 0,
                    ReviewCount = c.Reviews.Count,
                    Reviews = c.Reviews.Select(r => new ReviewDto
                    {
                        Id = r.Id,
                        Rating = r.Rating,
                        Comment = r.Comment,
                        UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Anonymous",
                        CreatedAt = r.CreatedAt
                    }).ToList()
                })
                .ToListAsync();

            return Ok(coaches);
        }

        // Get all coaches with coordinates
        var allCoaches = await _context.Coaches
            .Include(c => c.SubscriptionTier)
            .Include(c => c.Reviews)
            .ThenInclude(r => r.User)
            .Where(c => c.Latitude.HasValue && c.Longitude.HasValue)
            .ToListAsync();

        // Filter by radius using Haversine formula
        var coachesInRadius = allCoaches
            .Select(c => new
            {
                Coach = c,
                Distance = GeoUtils.CalculateDistance(
                    searchLat.Value, 
                    searchLon.Value, 
                    c.Latitude!.Value, 
                    c.Longitude!.Value)
            })
            .Where(x => x.Distance <= searchRadius)
            .OrderBy(x => x.Distance)
            .Select(x => new CoachProfileDto
            {
                Id = x.Coach.Id,
                Email = x.Coach.Email,
                FirstName = x.Coach.FirstName,
                LastName = x.Coach.LastName,
                Bio = x.Coach.Bio,
                Specialization = x.Coach.Specialization,
                ZipCode = x.Coach.ZipCode,
                PhoneNumber = x.Coach.PhoneNumber,
                YearsOfExperience = x.Coach.YearsOfExperience,
                SubscriptionTierName = x.Coach.SubscriptionTier != null ? x.Coach.SubscriptionTier.Name : "Free",
                AverageRating = x.Coach.Reviews.Any() ? x.Coach.Reviews.Average(r => r.Rating) : 0,
                ReviewCount = x.Coach.Reviews.Count,
                Reviews = x.Coach.Reviews.Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Anonymous",
                    CreatedAt = r.CreatedAt
                }).ToList()
            })
            .ToList();

        return Ok(coachesInRadius);
    }

    [Authorize(Roles = "Coach")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCoach(int id, [FromBody] UpdateCoachProfileRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        
        if (userId != id)
        {
            return Forbid();
        }

        var coach = await _context.Coaches.FindAsync(id);
        
        if (coach == null)
        {
            return NotFound();
        }

        coach.Bio = request.Bio;
        coach.Specialization = request.Specialization;
        coach.PhoneNumber = request.PhoneNumber;
        coach.YearsOfExperience = request.YearsOfExperience;

        // Update zipcode and coordinates if zipcode changed
        if (coach.ZipCode != request.ZipCode)
        {
            coach.ZipCode = request.ZipCode;
            var (latitude, longitude) = await _zipCodeService.GetCoordinatesAsync(request.ZipCode);
            coach.Latitude = latitude;
            coach.Longitude = longitude;
        }

        coach.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
