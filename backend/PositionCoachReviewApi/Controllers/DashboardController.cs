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
[Authorize(Roles = "Coach")]
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DashboardController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("clients")]
    public async Task<ActionResult<IEnumerable<ClientDto>>> GetClients()
    {
        var coachId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var clients = await _context.Clients
            .Where(c => c.CoachId == coachId)
            .Select(c => new ClientDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        return Ok(clients);
    }

    [HttpPost("clients")]
    public async Task<ActionResult<ClientDto>> AddClient([FromBody] CreateClientRequest request)
    {
        var coachId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Check subscription tier limits
        var coach = await _context.Coaches
            .Include(c => c.SubscriptionTier)
            .Include(c => c.Clients)
            .FirstOrDefaultAsync(c => c.Id == coachId);

        if (coach == null)
        {
            return NotFound();
        }

        if (coach.Clients.Count >= (coach.SubscriptionTier?.MaxClients ?? 5))
        {
            return BadRequest(new { message = "Client limit reached for your subscription tier" });
        }

        var client = new Client
        {
            Name = request.Name,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            CoachId = coachId
        };

        _context.Clients.Add(client);
        await _context.SaveChangesAsync();

        var clientDto = new ClientDto
        {
            Id = client.Id,
            Name = client.Name,
            Email = client.Email,
            PhoneNumber = client.PhoneNumber,
            CreatedAt = client.CreatedAt
        };

        return CreatedAtAction(nameof(GetClients), new { id = client.Id }, clientDto);
    }

    [HttpGet("reviews")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews()
    {
        var coachId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

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
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats()
    {
        var coachId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var clientCount = await _context.Clients.CountAsync(c => c.CoachId == coachId);
        var reviewCount = await _context.Reviews.CountAsync(r => r.CoachId == coachId);
        var averageRating = await _context.Reviews
            .Where(r => r.CoachId == coachId)
            .AverageAsync(r => (double?)r.Rating) ?? 0;

        return Ok(new
        {
            ClientCount = clientCount,
            ReviewCount = reviewCount,
            AverageRating = Math.Round(averageRating, 2)
        });
    }
}
