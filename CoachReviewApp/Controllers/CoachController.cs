using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoachReviewApp.Data;
using CoachReviewApp.Models;
using CoachReviewApp.ViewModels;

namespace CoachReviewApp.Controllers;

public class CoachController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public CoachController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IActionResult> Index(string? zipCode)
    {
        var query = _context.Coaches
            .Include(c => c.Reviews)
            .Include(c => c.SubscriptionTier)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(zipCode))
        {
            query = query.Where(c => c.ZipCode == zipCode);
            ViewData["ZipCode"] = zipCode;
        }

        var coaches = await query.OrderByDescending(c => c.Reviews.Average(r => (double?)r.Rating) ?? 0).ToListAsync();
        return View(coaches);
    }

    public async Task<IActionResult> Details(int id)
    {
        var coach = await _context.Coaches
            .Include(c => c.Reviews)
                .ThenInclude(r => r.User)
            .Include(c => c.SubscriptionTier)
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (coach == null)
        {
            return NotFound();
        }

        return View(coach);
    }

    [Authorize(Roles = "Coach")]
    [HttpGet]
    public async Task<IActionResult> Create()
    {
        var user = await _userManager.GetUserAsync(User);
        var existingCoach = await _context.Coaches.FirstOrDefaultAsync(c => c.UserId == user!.Id);

        if (existingCoach != null)
        {
            return RedirectToAction(nameof(Dashboard));
        }

        ViewBag.SubscriptionTiers = await _context.SubscriptionTiers.ToListAsync();
        return View();
    }

    [Authorize(Roles = "Coach")]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CoachProfileViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.GetUserAsync(User);
            
            var coach = new Coach
            {
                UserId = user!.Id,
                Name = model.Name,
                Bio = model.Bio,
                Specialization = model.Specialization,
                ZipCode = model.ZipCode,
                City = model.City,
                State = model.State,
                PhoneNumber = model.PhoneNumber,
                YearsOfExperience = model.YearsOfExperience,
                SubscriptionTierId = model.SubscriptionTierId
            };

            _context.Coaches.Add(coach);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Dashboard));
        }

        ViewBag.SubscriptionTiers = await _context.SubscriptionTiers.ToListAsync();
        return View(model);
    }

    [Authorize(Roles = "Coach")]
    [HttpGet]
    public async Task<IActionResult> Edit()
    {
        var user = await _userManager.GetUserAsync(User);
        var coach = await _context.Coaches
            .Include(c => c.SubscriptionTier)
            .FirstOrDefaultAsync(c => c.UserId == user!.Id);

        if (coach == null)
        {
            return RedirectToAction(nameof(Create));
        }

        var model = new CoachProfileViewModel
        {
            Name = coach.Name,
            Bio = coach.Bio,
            Specialization = coach.Specialization,
            ZipCode = coach.ZipCode,
            City = coach.City,
            State = coach.State,
            PhoneNumber = coach.PhoneNumber,
            YearsOfExperience = coach.YearsOfExperience,
            SubscriptionTierId = coach.SubscriptionTierId
        };

        ViewBag.SubscriptionTiers = await _context.SubscriptionTiers.ToListAsync();
        return View(model);
    }

    [Authorize(Roles = "Coach")]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(CoachProfileViewModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.GetUserAsync(User);
            var coach = await _context.Coaches.FirstOrDefaultAsync(c => c.UserId == user!.Id);

            if (coach == null)
            {
                return NotFound();
            }

            coach.Name = model.Name;
            coach.Bio = model.Bio;
            coach.Specialization = model.Specialization;
            coach.ZipCode = model.ZipCode;
            coach.City = model.City;
            coach.State = model.State;
            coach.PhoneNumber = model.PhoneNumber;
            coach.YearsOfExperience = model.YearsOfExperience;
            coach.SubscriptionTierId = model.SubscriptionTierId;

            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Dashboard));
        }

        ViewBag.SubscriptionTiers = await _context.SubscriptionTiers.ToListAsync();
        return View(model);
    }

    [Authorize(Roles = "Coach")]
    public async Task<IActionResult> Dashboard()
    {
        var user = await _userManager.GetUserAsync(User);
        var coach = await _context.Coaches
            .Include(c => c.Reviews)
                .ThenInclude(r => r.User)
            .Include(c => c.SubscriptionTier)
            .FirstOrDefaultAsync(c => c.UserId == user!.Id);

        if (coach == null)
        {
            return RedirectToAction(nameof(Create));
        }

        return View(coach);
    }
}
