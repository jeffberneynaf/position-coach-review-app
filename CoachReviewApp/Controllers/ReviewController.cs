using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoachReviewApp.Data;
using CoachReviewApp.Models;
using CoachReviewApp.ViewModels;

namespace CoachReviewApp.Controllers;

[Authorize(Roles = "Reviewer")]
public class ReviewController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ReviewController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> Create(int coachId)
    {
        var coach = await _context.Coaches.FindAsync(coachId);
        if (coach == null)
        {
            return NotFound();
        }

        var user = await _userManager.GetUserAsync(User);
        var existingReview = await _context.Reviews
            .FirstOrDefaultAsync(r => r.CoachId == coachId && r.UserId == user!.Id);

        if (existingReview != null)
        {
            TempData["Error"] = "You have already reviewed this coach.";
            return RedirectToAction("Details", "Coach", new { id = coachId });
        }

        ViewBag.CoachName = coach.Name;
        var model = new ReviewViewModel { CoachId = coachId };
        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(ReviewViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.GetUserAsync(User);
            
            var review = new Review
            {
                UserId = user!.Id,
                CoachId = model.CoachId,
                Rating = model.Rating,
                Comment = model.Comment
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            TempData["Success"] = "Review submitted successfully!";
            return RedirectToAction("Details", "Coach", new { id = model.CoachId });
        }

        var coach = await _context.Coaches.FindAsync(model.CoachId);
        ViewBag.CoachName = coach?.Name ?? "Unknown";
        return View(model);
    }
}
