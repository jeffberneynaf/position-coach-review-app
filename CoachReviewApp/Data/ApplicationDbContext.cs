using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CoachReviewApp.Models;

namespace CoachReviewApp.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Coach> Coaches { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<SubscriptionTier> SubscriptionTiers { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure relationships
        builder.Entity<Coach>()
            .HasOne(c => c.User)
            .WithOne(u => u.Coach)
            .HasForeignKey<Coach>(c => c.UserId);

        builder.Entity<Review>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reviews)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Review>()
            .HasOne(r => r.Coach)
            .WithMany(c => c.Reviews)
            .HasForeignKey(r => r.CoachId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Coach>()
            .HasOne(c => c.SubscriptionTier)
            .WithMany(st => st.Coaches)
            .HasForeignKey(c => c.SubscriptionTierId);

        // Seed subscription tiers
        builder.Entity<SubscriptionTier>().HasData(
            new SubscriptionTier
            {
                Id = 1,
                Name = "Basic",
                Description = "Perfect for new coaches getting started",
                Price = 29.99m,
                MaxReviews = 50,
                CanViewClientContacts = false,
                FeaturedListing = false
            },
            new SubscriptionTier
            {
                Id = 2,
                Name = "Professional",
                Description = "For established coaches seeking growth",
                Price = 79.99m,
                MaxReviews = 200,
                CanViewClientContacts = true,
                FeaturedListing = false
            },
            new SubscriptionTier
            {
                Id = 3,
                Name = "Elite",
                Description = "Premium features for top-tier coaches",
                Price = 149.99m,
                MaxReviews = -1, // Unlimited
                CanViewClientContacts = true,
                FeaturedListing = true
            }
        );
    }
}
