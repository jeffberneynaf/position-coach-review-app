using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Data;
using PositionCoachReviewApi.Models.DTOs;
using System.Security.Claims;

namespace PositionCoachReviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoachesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CoachesController(ApplicationDbContext context)
    {
        _context = context;
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
    public async Task<ActionResult<IEnumerable<CoachProfileDto>>> SearchCoachesByZipCode([FromQuery] string zipCode)
    {
        if (string.IsNullOrWhiteSpace(zipCode))
        {
            return BadRequest(new { message = "Zip code is required" });
        }

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
        coach.ZipCode = request.ZipCode;
        coach.PhoneNumber = request.PhoneNumber;
        coach.YearsOfExperience = request.YearsOfExperience;
        coach.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
