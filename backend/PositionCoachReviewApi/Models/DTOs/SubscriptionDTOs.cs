namespace PositionCoachReviewApi.Models.DTOs;

public class SubscriptionTierDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public int MaxClients { get; set; }
    public bool FeaturedListing { get; set; }
    public bool AnalyticsAccess { get; set; }
}
