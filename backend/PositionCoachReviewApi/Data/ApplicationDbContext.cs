using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Models;

namespace PositionCoachReviewApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Coach> Coaches { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<SubscriptionTier> SubscriptionTiers { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<ZipCode> ZipCodes { get; set; }
    public DbSet<AthleteProfile> AthleteProfiles { get; set; }
    public DbSet<CoachMatchProfile> CoachMatchProfiles { get; set; }
    public DbSet<MatchModel> MatchModels { get; set; }
    public DbSet<MatchInteraction> MatchInteractions { get; set; }
    public DbSet<MatchPreference> MatchPreferences { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        modelBuilder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Coach)
            .WithMany(c => c.Reviews)
            .HasForeignKey(r => r.CoachId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Coach>()
            .HasOne(c => c.SubscriptionTier)
            .WithMany(s => s.Coaches)
            .HasForeignKey(c => c.SubscriptionTierId);

        modelBuilder.Entity<Client>()
            .HasOne(c => c.Coach)
            .WithMany(c => c.Clients)
            .HasForeignKey(c => c.CoachId)
            .OnDelete(DeleteBehavior.Cascade);

        // Matchmaking relationships
        modelBuilder.Entity<AthleteProfile>()
            .HasOne(ap => ap.User)
            .WithOne(u => u.AthleteProfile)
            .HasForeignKey<AthleteProfile>(ap => ap.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CoachMatchProfile>()
            .HasOne(cmp => cmp.Coach)
            .WithOne(c => c.MatchProfile)
            .HasForeignKey<CoachMatchProfile>(cmp => cmp.CoachId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatchModel>()
            .HasOne(m => m.AthleteProfile)
            .WithMany(ap => ap.Matches)
            .HasForeignKey(m => m.AthleteProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatchModel>()
            .HasOne(m => m.CoachMatchProfile)
            .WithMany(cmp => cmp.Matches)
            .HasForeignKey(m => m.CoachMatchProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatchInteraction>()
            .HasOne(mi => mi.Match)
            .WithMany(m => m.Interactions)
            .HasForeignKey(mi => mi.MatchId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatchPreference>()
            .HasOne(mp => mp.AthleteProfile)
            .WithMany(ap => ap.MatchPreferences)
            .HasForeignKey(mp => mp.AthleteProfileId)
            .OnDelete(DeleteBehavior.Cascade);

        // Create indexes for matchmaking queries
        modelBuilder.Entity<AthleteProfile>()
            .HasIndex(ap => ap.Position);
        
        modelBuilder.Entity<AthleteProfile>()
            .HasIndex(ap => ap.SkillLevel);
        
        modelBuilder.Entity<AthleteProfile>()
            .HasIndex(ap => ap.ZipCode);

        modelBuilder.Entity<CoachMatchProfile>()
            .HasIndex(cmp => cmp.PositionsCoached);

        // Seed subscription tiers
        modelBuilder.Entity<SubscriptionTier>().HasData(
            new SubscriptionTier
            {
                Id = 1,
                Name = "Free",
                Price = 0,
                Description = "Basic listing with limited features",
                MaxClients = 5,
                FeaturedListing = false,
                AnalyticsAccess = false
            },
            new SubscriptionTier
            {
                Id = 2,
                Name = "Basic",
                Price = 29.99m,
                Description = "Enhanced listing with more client slots",
                MaxClients = 20,
                FeaturedListing = false,
                AnalyticsAccess = true
            },
            new SubscriptionTier
            {
                Id = 3,
                Name = "Premium",
                Price = 79.99m,
                Description = "Full-featured listing with unlimited clients and featured placement",
                MaxClients = 999,
                FeaturedListing = true,
                AnalyticsAccess = true
            }
        );
    }
}
