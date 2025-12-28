using System.Globalization;
using Microsoft.EntityFrameworkCore;
using PositionCoachReviewApi.Models;

namespace PositionCoachReviewApi.Data;

public static class ZipCodeSeeder
{
    public static async Task SeedZipCodesAsync(ApplicationDbContext context)
    {
        // Check if we already have zipcode data
        if (await context.ZipCodes.AnyAsync())
        {
            return;
        }

        var csvPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "SeedData", "zipcodes.csv");
        
        if (!File.Exists(csvPath))
        {
            Console.WriteLine($"Zipcode CSV file not found at: {csvPath}");
            return;
        }

        var zipCodes = new List<ZipCode>();
        var lines = await File.ReadAllLinesAsync(csvPath);
        
        // Skip header line
        for (int i = 1; i < lines.Length; i++)
        {
            var line = lines[i];
            if (string.IsNullOrWhiteSpace(line)) continue;

            var parts = line.Split(',');
            if (parts.Length == 3)
            {
                zipCodes.Add(new ZipCode
                {
                    Zip = parts[0].Trim(),
                    Latitude = double.Parse(parts[1].Trim(), CultureInfo.InvariantCulture),
                    Longitude = double.Parse(parts[2].Trim(), CultureInfo.InvariantCulture)
                });
            }
        }

        if (zipCodes.Any())
        {
            await context.ZipCodes.AddRangeAsync(zipCodes);
            await context.SaveChangesAsync();
            Console.WriteLine($"Seeded {zipCodes.Count} zipcodes into database");
        }
    }
}
