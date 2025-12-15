using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Data;
using PositionCoachReviewApi.Models.DTOs;
using System.Security.Claims;

namespace PositionCoachReviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SubscriptionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubscriptionTierDto>>> GetSubscriptionTiers()
    {
        var tiers = await _context.SubscriptionTiers
            .Select(t => new SubscriptionTierDto
            {
                Id = t.Id,
                Name = t.Name,
                Price = t.Price,
                Description = t.Description,
                MaxClients = t.MaxClients,
                FeaturedListing = t.FeaturedListing,
                AnalyticsAccess = t.AnalyticsAccess
            })
            .ToListAsync();

        return Ok(tiers);
    }

    [Authorize(Roles = "Coach")]
    [HttpPut("upgrade")]
    public async Task<IActionResult> UpgradeSubscription([FromBody] UpgradeSubscriptionRequest request)
    {
        var coachId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var coach = await _context.Coaches.FindAsync(coachId);
        if (coach == null)
        {
            return NotFound();
        }

        var tier = await _context.SubscriptionTiers.FindAsync(request.SubscriptionTierId);
        if (tier == null)
        {
            return BadRequest(new { message = "Invalid subscription tier" });
        }

        coach.SubscriptionTierId = request.SubscriptionTierId;
        coach.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Subscription updated successfully" });
    }
}
