using System.Globalization;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Data;
using PositionCoachReviewApi.Models;

namespace PositionCoachReviewApi.Services;

public interface IZipCodeService
{
    Task<(double? latitude, double? longitude)> GetCoordinatesAsync(string zipCode);
}

public class ZipCodeService : IZipCodeService
{
    private readonly ApplicationDbContext _context;

    public ZipCodeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(double? latitude, double? longitude)> GetCoordinatesAsync(string zipCode)
    {
        if (string.IsNullOrWhiteSpace(zipCode) || zipCode.Length < 5)
        {
            return (null, null);
        }

        // Take first 5 characters for lookup
        var zip = zipCode.Substring(0, 5);
        
        var zipCodeData = await _context.ZipCodes
            .FirstOrDefaultAsync(z => z.Zip == zip);

        if (zipCodeData == null)
        {
            return (null, null);
        }

        return (zipCodeData.Latitude, zipCodeData.Longitude);
    }
}
