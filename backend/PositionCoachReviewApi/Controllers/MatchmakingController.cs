using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Data;
using PositionCoachReviewApi.Models;
using PositionCoachReviewApi.Models.DTOs;
using PositionCoachReviewApi.Services;

namespace PositionCoachReviewApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MatchmakingController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMatchingAlgorithmService _matchingService;

    public MatchmakingController(ApplicationDbContext context, IMatchingAlgorithmService matchingService)
    {
        _context = context;
        _matchingService = matchingService;
    }

    // ==================== Athlete Profile Endpoints ====================

    [HttpPost("athlete-profile")]
    public async Task<ActionResult<AthleteProfileDto>> CreateAthleteProfile([FromBody] CreateAthleteProfileRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        // Check if user exists
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound("User not found");
        }

        // Check if athlete profile already exists
        var existingProfile = await _context.AthleteProfiles
            .FirstOrDefaultAsync(ap => ap.UserId == userId);
        if (existingProfile != null)
        {
            return BadRequest("Athlete profile already exists for this user");
        }

        var athleteProfile = new AthleteProfile
        {
            UserId = userId,
            AthleteName = request.AthleteName,
            DateOfBirth = request.DateOfBirth,
            Position = request.Position,
            SkillLevel = request.SkillLevel,
            ZipCode = request.ZipCode,
            TrainingIntensity = request.TrainingIntensity,
            PreferredSchedule = request.PreferredSchedule,
            SessionsPerWeek = request.SessionsPerWeek,
            SessionDuration = request.SessionDuration,
            PreferredCoachingStyle = request.PreferredCoachingStyle,
            PreferredCommunicationStyle = request.PreferredCommunicationStyle,
            PreferGroupTraining = request.PreferGroupTraining,
            PreferOneOnOne = request.PreferOneOnOne,
            PrimaryGoalsJson = JsonSerializer.Serialize(request.PrimaryGoals),
            AreasForImprovementJson = JsonSerializer.Serialize(request.AreasForImprovement),
            SpecialNeeds = request.SpecialNeeds,
            MaxBudgetPerSession = request.MaxBudgetPerSession,
            MaxTravelDistanceMiles = request.MaxTravelDistanceMiles,
            WillingToTravel = request.WillingToTravel,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.AthleteProfiles.Add(athleteProfile);
        await _context.SaveChangesAsync();

        return Ok(MapToAthleteProfileDto(athleteProfile));
    }

    [HttpGet("athlete-profile")]
    public async Task<ActionResult<AthleteProfileDto>> GetAthleteProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        var athleteProfile = await _context.AthleteProfiles
            .FirstOrDefaultAsync(ap => ap.UserId == userId);

        if (athleteProfile == null)
        {
            return NotFound("Athlete profile not found");
        }

        return Ok(MapToAthleteProfileDto(athleteProfile));
    }

    [HttpPut("athlete-profile")]
    public async Task<ActionResult<AthleteProfileDto>> UpdateAthleteProfile([FromBody] UpdateAthleteProfileRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        var athleteProfile = await _context.AthleteProfiles
            .FirstOrDefaultAsync(ap => ap.UserId == userId);

        if (athleteProfile == null)
        {
            return NotFound("Athlete profile not found");
        }

        athleteProfile.AthleteName = request.AthleteName;
        athleteProfile.DateOfBirth = request.DateOfBirth;
        athleteProfile.Position = request.Position;
        athleteProfile.SkillLevel = request.SkillLevel;
        athleteProfile.ZipCode = request.ZipCode;
        athleteProfile.TrainingIntensity = request.TrainingIntensity;
        athleteProfile.PreferredSchedule = request.PreferredSchedule;
        athleteProfile.SessionsPerWeek = request.SessionsPerWeek;
        athleteProfile.SessionDuration = request.SessionDuration;
        athleteProfile.PreferredCoachingStyle = request.PreferredCoachingStyle;
        athleteProfile.PreferredCommunicationStyle = request.PreferredCommunicationStyle;
        athleteProfile.PreferGroupTraining = request.PreferGroupTraining;
        athleteProfile.PreferOneOnOne = request.PreferOneOnOne;
        athleteProfile.PrimaryGoalsJson = JsonSerializer.Serialize(request.PrimaryGoals);
        athleteProfile.AreasForImprovementJson = JsonSerializer.Serialize(request.AreasForImprovement);
        athleteProfile.SpecialNeeds = request.SpecialNeeds;
        athleteProfile.MaxBudgetPerSession = request.MaxBudgetPerSession;
        athleteProfile.MaxTravelDistanceMiles = request.MaxTravelDistanceMiles;
        athleteProfile.WillingToTravel = request.WillingToTravel;
        athleteProfile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(MapToAthleteProfileDto(athleteProfile));
    }

    // ==================== Coach Match Profile Endpoints ====================

    [HttpPost("coach-profile")]
    public async Task<ActionResult<CoachMatchProfileDto>> CreateCoachMatchProfile([FromBody] CreateCoachMatchProfileRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userTypeClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int coachId))
        {
            return Unauthorized("Invalid user token");
        }

        if (userTypeClaim != "Coach")
        {
            return Forbid("Only coaches can create match profiles");
        }

        // Check if coach exists
        var coach = await _context.Coaches.FindAsync(coachId);
        if (coach == null)
        {
            return NotFound("Coach not found");
        }

        // Check if coach match profile already exists
        var existingProfile = await _context.CoachMatchProfiles
            .FirstOrDefaultAsync(cmp => cmp.CoachId == coachId);
        if (existingProfile != null)
        {
            return BadRequest("Coach match profile already exists");
        }

        var coachProfile = new CoachMatchProfile
        {
            CoachId = coachId,
            CoachingStyle = request.CoachingStyle,
            CommunicationStyle = request.CommunicationStyle,
            TrainingPhilosophy = request.TrainingPhilosophy,
            SpecialtiesJson = JsonSerializer.Serialize(request.Specialties),
            PositionsCoached = request.PositionsCoached,
            SkillLevelsAccepted = request.SkillLevelsAccepted,
            AcceptsGroupTraining = request.AcceptsGroupTraining,
            AcceptsOneOnOne = request.AcceptsOneOnOne,
            AvailableDaysJson = JsonSerializer.Serialize(request.AvailableDays),
            AvailableTimeSlotsJson = JsonSerializer.Serialize(request.AvailableTimeSlots),
            MaxNewClientsPerMonth = request.MaxNewClientsPerMonth,
            SessionPriceMin = request.SessionPriceMin,
            SessionPriceMax = request.SessionPriceMax,
            TravelRadiusMiles = request.TravelRadiusMiles,
            OffersVirtualSessions = request.OffersVirtualSessions,
            OffersInPersonSessions = request.OffersInPersonSessions,
            SuccessStoriesJson = JsonSerializer.Serialize(request.SuccessStories),
            YearsCoachingPosition = request.YearsCoachingPosition,
            CertificationsJson = JsonSerializer.Serialize(request.Certifications),
            PreferredAthleteTraitsJson = JsonSerializer.Serialize(request.PreferredAthleteTraits),
            MinAgeAccepted = request.MinAgeAccepted,
            MaxAgeAccepted = request.MaxAgeAccepted,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.CoachMatchProfiles.Add(coachProfile);
        await _context.SaveChangesAsync();

        return Ok(await MapToCoachMatchProfileDto(coachProfile, coach));
    }

    [HttpGet("coach-profile")]
    public async Task<ActionResult<CoachMatchProfileDto>> GetCoachMatchProfile()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userTypeClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int coachId))
        {
            return Unauthorized("Invalid user token");
        }

        if (userTypeClaim != "Coach")
        {
            return Forbid("Only coaches can access match profiles");
        }

        var coachProfile = await _context.CoachMatchProfiles
            .Include(cmp => cmp.Coach)
            .FirstOrDefaultAsync(cmp => cmp.CoachId == coachId);

        if (coachProfile == null)
        {
            return NotFound("Coach match profile not found");
        }

        return Ok(await MapToCoachMatchProfileDto(coachProfile, coachProfile.Coach!));
    }

    [HttpPut("coach-profile")]
    public async Task<ActionResult<CoachMatchProfileDto>> UpdateCoachMatchProfile([FromBody] UpdateCoachMatchProfileRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userTypeClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int coachId))
        {
            return Unauthorized("Invalid user token");
        }

        if (userTypeClaim != "Coach")
        {
            return Forbid("Only coaches can update match profiles");
        }

        var coachProfile = await _context.CoachMatchProfiles
            .Include(cmp => cmp.Coach)
            .FirstOrDefaultAsync(cmp => cmp.CoachId == coachId);

        if (coachProfile == null)
        {
            return NotFound("Coach match profile not found");
        }

        coachProfile.CoachingStyle = request.CoachingStyle;
        coachProfile.CommunicationStyle = request.CommunicationStyle;
        coachProfile.TrainingPhilosophy = request.TrainingPhilosophy;
        coachProfile.SpecialtiesJson = JsonSerializer.Serialize(request.Specialties);
        coachProfile.PositionsCoached = request.PositionsCoached;
        coachProfile.SkillLevelsAccepted = request.SkillLevelsAccepted;
        coachProfile.AcceptsGroupTraining = request.AcceptsGroupTraining;
        coachProfile.AcceptsOneOnOne = request.AcceptsOneOnOne;
        coachProfile.AvailableDaysJson = JsonSerializer.Serialize(request.AvailableDays);
        coachProfile.AvailableTimeSlotsJson = JsonSerializer.Serialize(request.AvailableTimeSlots);
        coachProfile.MaxNewClientsPerMonth = request.MaxNewClientsPerMonth;
        coachProfile.SessionPriceMin = request.SessionPriceMin;
        coachProfile.SessionPriceMax = request.SessionPriceMax;
        coachProfile.TravelRadiusMiles = request.TravelRadiusMiles;
        coachProfile.OffersVirtualSessions = request.OffersVirtualSessions;
        coachProfile.OffersInPersonSessions = request.OffersInPersonSessions;
        coachProfile.SuccessStoriesJson = JsonSerializer.Serialize(request.SuccessStories);
        coachProfile.YearsCoachingPosition = request.YearsCoachingPosition;
        coachProfile.CertificationsJson = JsonSerializer.Serialize(request.Certifications);
        coachProfile.PreferredAthleteTraitsJson = JsonSerializer.Serialize(request.PreferredAthleteTraits);
        coachProfile.MinAgeAccepted = request.MinAgeAccepted;
        coachProfile.MaxAgeAccepted = request.MaxAgeAccepted;
        coachProfile.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(await MapToCoachMatchProfileDto(coachProfile, coachProfile.Coach!));
    }

    // ==================== Match Finding Endpoints ====================

    [HttpPost("find-matches")]
    public async Task<ActionResult<PaginatedMatchesResponse>> FindMatches([FromBody] FindMatchesRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        // Get athlete profile
        var athleteProfile = await _context.AthleteProfiles
            .FirstOrDefaultAsync(ap => ap.UserId == userId);

        if (athleteProfile == null)
        {
            return NotFound("Athlete profile not found. Please create a profile first.");
        }

        // Get athlete zipcode
        var athleteZipCode = await _context.ZipCodes
            .FirstOrDefaultAsync(z => z.Zip == athleteProfile.ZipCode);

        // Query coach profiles with filters
        var query = _context.CoachMatchProfiles
            .Include(cmp => cmp.Coach)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(request.Position))
        {
            query = query.Where(cmp => cmp.PositionsCoached.Contains(request.Position));
        }

        if (!string.IsNullOrEmpty(request.SkillLevel))
        {
            query = query.Where(cmp => cmp.SkillLevelsAccepted.Contains(request.SkillLevel) ||
                                      cmp.SkillLevelsAccepted.Contains("All"));
        }

        if (request.MaxPrice.HasValue)
        {
            query = query.Where(cmp => cmp.SessionPriceMin <= request.MaxPrice.Value);
        }

        if (request.OffersVirtual.HasValue && request.OffersVirtual.Value)
        {
            query = query.Where(cmp => cmp.OffersVirtualSessions);
        }

        if (request.OffersInPerson.HasValue && request.OffersInPerson.Value)
        {
            query = query.Where(cmp => cmp.OffersInPersonSessions);
        }

        if (!string.IsNullOrEmpty(request.CoachingStyle))
        {
            query = query.Where(cmp => cmp.CoachingStyle.Contains(request.CoachingStyle));
        }

        var coachProfiles = await query.ToListAsync();

        // Calculate match scores
        var matchesWithScores = new List<(CoachMatchProfile profile, Coach coach, double score, MatchScoreBreakdown breakdown, List<string> reasons)>();

        foreach (var coachProfile in coachProfiles)
        {
            var coachZipCode = await _context.ZipCodes
                .FirstOrDefaultAsync(z => z.Zip == coachProfile.Coach!.ZipCode);

            var (score, breakdown, reasons) = await _matchingService.CalculateMatchScore(
                athleteProfile, coachProfile, coachProfile.Coach!, athleteZipCode, coachZipCode);

            if (score >= request.MinMatchScore)
            {
                matchesWithScores.Add((coachProfile, coachProfile.Coach!, score, breakdown, reasons));
            }
        }

        // Sort by score
        matchesWithScores = matchesWithScores.OrderByDescending(m => m.score).ToList();

        // Apply pagination
        var totalCount = matchesWithScores.Count;
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);
        
        var paginatedMatches = matchesWithScores
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToList();

        // Check for existing matches and create or update
        var matchDtos = new List<MatchDto>();

        foreach (var (profile, coach, score, breakdown, reasons) in paginatedMatches)
        {
            // Check if match already exists
            var existingMatch = await _context.MatchModels
                .Include(m => m.Interactions)
                .FirstOrDefaultAsync(m => m.AthleteProfileId == athleteProfile.Id &&
                                         m.CoachMatchProfileId == profile.Id);

            if (existingMatch != null)
            {
                // Update existing match score
                existingMatch.MatchScore = score;
                existingMatch.MatchReasonsJson = JsonSerializer.Serialize(reasons);
                existingMatch.ScoreBreakdownJson = JsonSerializer.Serialize(breakdown);
                existingMatch.UpdatedAt = DateTime.UtcNow;
                
                matchDtos.Add(await MapToMatchDto(existingMatch, athleteProfile, profile, coach));
            }
            else
            {
                // Create new match
                var newMatch = new MatchModel
                {
                    AthleteProfileId = athleteProfile.Id,
                    CoachMatchProfileId = profile.Id,
                    MatchScore = score,
                    MatchReasonsJson = JsonSerializer.Serialize(reasons),
                    ScoreBreakdownJson = JsonSerializer.Serialize(breakdown),
                    Status = "Suggested",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.MatchModels.Add(newMatch);
                matchDtos.Add(await MapToMatchDto(newMatch, athleteProfile, profile, coach));
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new PaginatedMatchesResponse
        {
            Matches = matchDtos,
            TotalCount = totalCount,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalPages = totalPages
        });
    }

    [HttpGet("matches")]
    public async Task<ActionResult<List<MatchDto>>> GetMatches([FromQuery] string? status = null)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userTypeClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        List<MatchModel> matches;

        if (userTypeClaim == "Coach")
        {
            var coachProfile = await _context.CoachMatchProfiles
                .FirstOrDefaultAsync(cmp => cmp.CoachId == userId);

            if (coachProfile == null)
            {
                return Ok(new List<MatchDto>());
            }

            var query = _context.MatchModels
                .Include(m => m.AthleteProfile)
                .Include(m => m.CoachMatchProfile)
                    .ThenInclude(cmp => cmp!.Coach)
                .Include(m => m.Interactions)
                .Where(m => m.CoachMatchProfileId == coachProfile.Id && m.IsActive);

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(m => m.Status == status);
            }

            matches = await query.OrderByDescending(m => m.MatchScore).ToListAsync();
        }
        else
        {
            var athleteProfile = await _context.AthleteProfiles
                .FirstOrDefaultAsync(ap => ap.UserId == userId);

            if (athleteProfile == null)
            {
                return Ok(new List<MatchDto>());
            }

            var query = _context.MatchModels
                .Include(m => m.AthleteProfile)
                .Include(m => m.CoachMatchProfile)
                    .ThenInclude(cmp => cmp!.Coach)
                .Include(m => m.Interactions)
                .Where(m => m.AthleteProfileId == athleteProfile.Id && m.IsActive);

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(m => m.Status == status);
            }

            matches = await query.OrderByDescending(m => m.MatchScore).ToListAsync();
        }

        var matchDtos = new List<MatchDto>();
        foreach (var match in matches)
        {
            matchDtos.Add(await MapToMatchDto(
                match,
                match.AthleteProfile!,
                match.CoachMatchProfile!,
                match.CoachMatchProfile.Coach!));
        }

        return Ok(matchDtos);
    }

    [HttpGet("matches/{id}")]
    public async Task<ActionResult<MatchDto>> GetMatch(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        var match = await _context.MatchModels
            .Include(m => m.AthleteProfile)
            .Include(m => m.CoachMatchProfile)
                .ThenInclude(cmp => cmp!.Coach)
            .Include(m => m.Interactions)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match == null)
        {
            return NotFound("Match not found");
        }

        // Verify user has access to this match
        var userTypeClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        if (userTypeClaim == "Coach")
        {
            if (match.CoachMatchProfile?.CoachId != userId)
            {
                return Forbid("You don't have access to this match");
            }
        }
        else
        {
            if (match.AthleteProfile?.UserId != userId)
            {
                return Forbid("You don't have access to this match");
            }
        }

        return Ok(await MapToMatchDto(
            match,
            match.AthleteProfile!,
            match.CoachMatchProfile!,
            match.CoachMatchProfile.Coach!));
    }

    [HttpPost("matches/{id}/interact")]
    public async Task<ActionResult<MatchDto>> InteractWithMatch(int id, [FromBody] MatchInteractionRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userTypeClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        var match = await _context.MatchModels
            .Include(m => m.AthleteProfile)
            .Include(m => m.CoachMatchProfile)
                .ThenInclude(cmp => cmp!.Coach)
            .Include(m => m.Interactions)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match == null)
        {
            return NotFound("Match not found");
        }

        // Verify user has access
        bool isCoach = userTypeClaim == "Coach";
        if (isCoach && match.CoachMatchProfile?.CoachId != userId)
        {
            return Forbid("You don't have access to this match");
        }
        if (!isCoach && match.AthleteProfile?.UserId != userId)
        {
            return Forbid("You don't have access to this match");
        }

        // Create interaction
        var interaction = new MatchInteraction
        {
            MatchId = match.Id,
            ActorType = isCoach ? "Coach" : "Athlete",
            ActorId = userId,
            ActionType = request.ActionType,
            Message = request.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.MatchInteractions.Add(interaction);

        // Update match status based on action
        switch (request.ActionType.ToLower())
        {
            case "like":
            case "interested":
                if (isCoach)
                {
                    match.CoachInterestedAt = DateTime.UtcNow;
                    // Check for mutual interest
                    if (match.AthleteInterestedAt.HasValue)
                    {
                        match.Status = "Connected";
                        match.ConnectedAt = DateTime.UtcNow;
                    }
                    else
                    {
                        match.Status = "CoachInterested";
                    }
                }
                else
                {
                    match.AthleteInterestedAt = DateTime.UtcNow;
                    // Check for mutual interest
                    if (match.CoachInterestedAt.HasValue)
                    {
                        match.Status = "Connected";
                        match.ConnectedAt = DateTime.UtcNow;
                    }
                    else
                    {
                        match.Status = "AthleteInterested";
                    }
                }
                break;

            case "pass":
            case "dismiss":
                match.IsActive = false;
                match.Status = "Dismissed";
                break;

            case "view":
                // Just record the view, don't change status
                break;

            case "message":
                // Keep current status
                break;
        }

        match.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(await MapToMatchDto(
            match,
            match.AthleteProfile!,
            match.CoachMatchProfile!,
            match.CoachMatchProfile.Coach!));
    }

    [HttpPut("matches/{id}/status")]
    public async Task<ActionResult<MatchDto>> UpdateMatchStatus(int id, [FromBody] UpdateMatchStatusRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userTypeClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        var match = await _context.MatchModels
            .Include(m => m.AthleteProfile)
            .Include(m => m.CoachMatchProfile)
                .ThenInclude(cmp => cmp!.Coach)
            .Include(m => m.Interactions)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (match == null)
        {
            return NotFound("Match not found");
        }

        // Verify user has access
        bool isCoach = userTypeClaim == "Coach";
        if (isCoach && match.CoachMatchProfile?.CoachId != userId)
        {
            return Forbid("You don't have access to this match");
        }
        if (!isCoach && match.AthleteProfile?.UserId != userId)
        {
            return Forbid("You don't have access to this match");
        }

        match.Status = request.Status;
        
        if (isCoach)
        {
            match.CoachNotes = request.Notes;
        }
        else
        {
            match.AthleteNotes = request.Notes;
        }

        match.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(await MapToMatchDto(
            match,
            match.AthleteProfile!,
            match.CoachMatchProfile!,
            match.CoachMatchProfile.Coach!));
    }

    [HttpGet("stats")]
    public async Task<ActionResult<MatchmakingStatsDto>> GetStats()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userTypeClaim = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Invalid user token");
        }

        List<MatchModel> matches;

        if (userTypeClaim == "Coach")
        {
            var coachProfile = await _context.CoachMatchProfiles
                .FirstOrDefaultAsync(cmp => cmp.CoachId == userId);

            if (coachProfile == null)
            {
                return Ok(new MatchmakingStatsDto());
            }

            matches = await _context.MatchModels
                .Include(m => m.Interactions)
                .Where(m => m.CoachMatchProfileId == coachProfile.Id)
                .ToListAsync();
        }
        else
        {
            var athleteProfile = await _context.AthleteProfiles
                .FirstOrDefaultAsync(ap => ap.UserId == userId);

            if (athleteProfile == null)
            {
                return Ok(new MatchmakingStatsDto());
            }

            matches = await _context.MatchModels
                .Include(m => m.Interactions)
                .Where(m => m.AthleteProfileId == athleteProfile.Id)
                .ToListAsync();
        }

        var stats = new MatchmakingStatsDto
        {
            TotalMatches = matches.Count,
            SuggestedMatches = matches.Count(m => m.Status == "Suggested"),
            InterestedMatches = matches.Count(m => m.Status.Contains("Interested")),
            ConnectedMatches = matches.Count(m => m.Status == "Connected"),
            AverageMatchScore = matches.Any() ? matches.Average(m => m.MatchScore) : 0,
            TotalInteractions = matches.Sum(m => m.Interactions.Count)
        };

        return Ok(stats);
    }

    // ==================== Helper Methods ====================

    private AthleteProfileDto MapToAthleteProfileDto(AthleteProfile profile)
    {
        List<string> primaryGoals = new();
        List<string> areasForImprovement = new();

        try
        {
            if (!string.IsNullOrEmpty(profile.PrimaryGoalsJson))
                primaryGoals = JsonSerializer.Deserialize<List<string>>(profile.PrimaryGoalsJson) ?? new();
            if (!string.IsNullOrEmpty(profile.AreasForImprovementJson))
                areasForImprovement = JsonSerializer.Deserialize<List<string>>(profile.AreasForImprovementJson) ?? new();
        }
        catch { }

        return new AthleteProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            AthleteName = profile.AthleteName,
            DateOfBirth = profile.DateOfBirth,
            Age = DateTime.UtcNow.Year - profile.DateOfBirth.Year,
            Position = profile.Position,
            SkillLevel = profile.SkillLevel,
            ZipCode = profile.ZipCode,
            TrainingIntensity = profile.TrainingIntensity,
            PreferredSchedule = profile.PreferredSchedule,
            SessionsPerWeek = profile.SessionsPerWeek,
            SessionDuration = profile.SessionDuration,
            PreferredCoachingStyle = profile.PreferredCoachingStyle,
            PreferredCommunicationStyle = profile.PreferredCommunicationStyle,
            PreferGroupTraining = profile.PreferGroupTraining,
            PreferOneOnOne = profile.PreferOneOnOne,
            PrimaryGoals = primaryGoals,
            AreasForImprovement = areasForImprovement,
            SpecialNeeds = profile.SpecialNeeds,
            MaxBudgetPerSession = profile.MaxBudgetPerSession,
            MaxTravelDistanceMiles = profile.MaxTravelDistanceMiles,
            WillingToTravel = profile.WillingToTravel,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }

    private async Task<CoachMatchProfileDto> MapToCoachMatchProfileDto(CoachMatchProfile profile, Coach coach)
    {
        List<string> specialties = new();
        List<string> availableDays = new();
        List<string> availableTimeSlots = new();
        List<string> successStories = new();
        List<string> certifications = new();
        List<string> preferredAthleteTraits = new();

        try
        {
            if (!string.IsNullOrEmpty(profile.SpecialtiesJson))
                specialties = JsonSerializer.Deserialize<List<string>>(profile.SpecialtiesJson) ?? new();
            if (!string.IsNullOrEmpty(profile.AvailableDaysJson))
                availableDays = JsonSerializer.Deserialize<List<string>>(profile.AvailableDaysJson) ?? new();
            if (!string.IsNullOrEmpty(profile.AvailableTimeSlotsJson))
                availableTimeSlots = JsonSerializer.Deserialize<List<string>>(profile.AvailableTimeSlotsJson) ?? new();
            if (!string.IsNullOrEmpty(profile.SuccessStoriesJson))
                successStories = JsonSerializer.Deserialize<List<string>>(profile.SuccessStoriesJson) ?? new();
            if (!string.IsNullOrEmpty(profile.CertificationsJson))
                certifications = JsonSerializer.Deserialize<List<string>>(profile.CertificationsJson) ?? new();
            if (!string.IsNullOrEmpty(profile.PreferredAthleteTraitsJson))
                preferredAthleteTraits = JsonSerializer.Deserialize<List<string>>(profile.PreferredAthleteTraitsJson) ?? new();
        }
        catch { }

        return new CoachMatchProfileDto
        {
            Id = profile.Id,
            CoachId = profile.CoachId,
            CoachFirstName = coach.FirstName,
            CoachLastName = coach.LastName,
            CoachEmail = coach.Email,
            CoachingStyle = profile.CoachingStyle,
            CommunicationStyle = profile.CommunicationStyle,
            TrainingPhilosophy = profile.TrainingPhilosophy,
            Specialties = specialties,
            PositionsCoached = profile.PositionsCoached,
            SkillLevelsAccepted = profile.SkillLevelsAccepted,
            AcceptsGroupTraining = profile.AcceptsGroupTraining,
            AcceptsOneOnOne = profile.AcceptsOneOnOne,
            AvailableDays = availableDays,
            AvailableTimeSlots = availableTimeSlots,
            MaxNewClientsPerMonth = profile.MaxNewClientsPerMonth,
            SessionPriceMin = profile.SessionPriceMin,
            SessionPriceMax = profile.SessionPriceMax,
            TravelRadiusMiles = profile.TravelRadiusMiles,
            OffersVirtualSessions = profile.OffersVirtualSessions,
            OffersInPersonSessions = profile.OffersInPersonSessions,
            SuccessStories = successStories,
            YearsCoachingPosition = profile.YearsCoachingPosition,
            Certifications = certifications,
            PreferredAthleteTraits = preferredAthleteTraits,
            MinAgeAccepted = profile.MinAgeAccepted,
            MaxAgeAccepted = profile.MaxAgeAccepted,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt
        };
    }

    private async Task<MatchDto> MapToMatchDto(
        MatchModel match,
        AthleteProfile athleteProfile,
        CoachMatchProfile coachProfile,
        Coach coach)
    {
        List<string> matchReasons = new();
        MatchScoreBreakdown? scoreBreakdown = null;

        try
        {
            if (!string.IsNullOrEmpty(match.MatchReasonsJson))
                matchReasons = JsonSerializer.Deserialize<List<string>>(match.MatchReasonsJson) ?? new();
            if (!string.IsNullOrEmpty(match.ScoreBreakdownJson))
                scoreBreakdown = JsonSerializer.Deserialize<MatchScoreBreakdown>(match.ScoreBreakdownJson);
        }
        catch { }

        return new MatchDto
        {
            Id = match.Id,
            AthleteProfileId = match.AthleteProfileId,
            AthleteProfile = MapToAthleteProfileDto(athleteProfile),
            CoachMatchProfileId = match.CoachMatchProfileId,
            CoachMatchProfile = await MapToCoachMatchProfileDto(coachProfile, coach),
            MatchScore = match.MatchScore,
            MatchReasons = matchReasons,
            ScoreBreakdown = scoreBreakdown,
            Status = match.Status,
            AthleteInterestedAt = match.AthleteInterestedAt,
            CoachInterestedAt = match.CoachInterestedAt,
            ConnectedAt = match.ConnectedAt,
            AthleteNotes = match.AthleteNotes,
            CoachNotes = match.CoachNotes,
            CreatedAt = match.CreatedAt,
            UpdatedAt = match.UpdatedAt,
            IsActive = match.IsActive,
            Interactions = match.Interactions.Select(i => new MatchInteractionDto
            {
                Id = i.Id,
                MatchId = i.MatchId,
                ActorType = i.ActorType,
                ActorId = i.ActorId,
                ActionType = i.ActionType,
                Message = i.Message,
                CreatedAt = i.CreatedAt
            }).ToList()
        };
    }
}
