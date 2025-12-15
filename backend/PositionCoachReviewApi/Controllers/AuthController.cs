using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Data;
using PositionCoachReviewApi.Models;
using PositionCoachReviewApi.Models.DTOs;
using PositionCoachReviewApi.Services;
using BCrypt.Net;

namespace PositionCoachReviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthController(ApplicationDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register/user")]
    public async Task<ActionResult<AuthResponse>> RegisterUser([FromBody] RegisterUserRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

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

    [HttpPost("register/coach")]
    public async Task<ActionResult<AuthResponse>> RegisterCoach([FromBody] RegisterCoachRequest request)
    {
        if (await _context.Coaches.AnyAsync(c => c.Email == request.Email))
        {
            return BadRequest(new { message = "Email already registered" });
        }

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
            SubscriptionTierId = 1 // Default to Free tier
        };

        _context.Coaches.Add(coach);
        await _context.SaveChangesAsync();

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

    [HttpPost("login/user")]
    public async Task<ActionResult<AuthResponse>> LoginUser([FromBody] LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
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
}
