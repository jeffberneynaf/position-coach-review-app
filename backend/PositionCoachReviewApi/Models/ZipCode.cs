using System.ComponentModel.DataAnnotations;

namespace PositionCoachReviewApi.Models;

public class ZipCode
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [StringLength(5)]
    public string Zip { get; set; } = string.Empty;
    
    [Required]
    public double Latitude { get; set; }
    
    [Required]
    public double Longitude { get; set; }
}
