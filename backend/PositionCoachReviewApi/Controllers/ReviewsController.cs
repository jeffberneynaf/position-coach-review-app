using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Data;
using PositionCoachReviewApi.Models;
using PositionCoachReviewApi.Models.DTOs;
using System.Security.Claims;

namespace PositionCoachReviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [Authorize(Roles = "User")]
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview([FromBody] CreateReviewRequest request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Check if coach exists
        var coach = await _context.Coaches.FindAsync(request.CoachId);
        if (coach == null)
        {
            return NotFound(new { message = "Coach not found" });
        }

        // Check if user already reviewed this coach
        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.UserId == userId && r.CoachId == request.CoachId);
        
        if (existingReview != null)
        {
            return BadRequest(new { message = "You have already reviewed this coach" });
        }

        var review = new Review
        {
            Rating = request.Rating,
            Comment = request.Comment,
            UserId = userId,
            CoachId = request.CoachId
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        // Fetch user info for response
        var user = await _context.Users.FindAsync(userId);

        var reviewDto = new ReviewDto
        {
            Id = review.Id,
            Rating = review.Rating,
            Comment = review.Comment,
            UserName = user != null ? $"{user.FirstName} {user.LastName}" : "Anonymous",
            CreatedAt = review.CreatedAt
        };

        return CreatedAtAction(nameof(GetReview), new { id = review.Id }, reviewDto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ReviewDto>> GetReview(int id)
    {
        var review = await _context.Reviews
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (review == null)
        {
            return NotFound();
        }

        var reviewDto = new ReviewDto
        {
            Id = review.Id,
            Rating = review.Rating,
            Comment = review.Comment,
            UserName = review.User != null ? $"{review.User.FirstName} {review.User.LastName}" : "Anonymous",
            CreatedAt = review.CreatedAt
        };

        return Ok(reviewDto);
    }

    [HttpGet("coach/{coachId}")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetCoachReviews(int coachId)
    {
        var reviews = await _context.Reviews
            .Include(r => r.User)
            .Where(r => r.CoachId == coachId)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                Rating = r.Rating,
                Comment = r.Comment,
                UserName = r.User != null ? $"{r.User.FirstName} {r.User.LastName}" : "Anonymous",
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();

        return Ok(reviews);
    }
}
