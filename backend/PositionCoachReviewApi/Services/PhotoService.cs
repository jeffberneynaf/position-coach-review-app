using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;

namespace PositionCoachReviewApi.Services;

public class PhotoService : IPhotoService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<PhotoService> _logger;
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
    private const int MinWidth = 200;
    private const int MinHeight = 200;
    private const int ThumbnailSize = 150;
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };

    public PhotoService(IWebHostEnvironment environment, ILogger<PhotoService> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    public async Task<bool> ValidatePhotoAsync(IFormFile photo)
    {
        // Check if file exists
        if (photo == null || photo.Length == 0)
        {
            _logger.LogWarning("Photo validation failed: File is null or empty");
            return false;
        }

        // Check file size
        if (photo.Length > MaxFileSize)
        {
            _logger.LogWarning("Photo validation failed: File size {Size} exceeds maximum {MaxSize}", photo.Length, MaxFileSize);
            return false;
        }

        // Check file extension
        var extension = Path.GetExtension(photo.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            _logger.LogWarning("Photo validation failed: Extension {Extension} not allowed", extension);
            return false;
        }

        // Check MIME type
        if (!AllowedMimeTypes.Contains(photo.ContentType.ToLowerInvariant()))
        {
            _logger.LogWarning("Photo validation failed: MIME type {MimeType} not allowed", photo.ContentType);
            return false;
        }

        // Check image dimensions
        try
        {
            using var stream = photo.OpenReadStream();
            var image = await Image.LoadAsync(stream);
            
            if (image.Width < MinWidth || image.Height < MinHeight)
            {
                _logger.LogWarning("Photo validation failed: Dimensions {Width}x{Height} below minimum {MinWidth}x{MinHeight}", 
                    image.Width, image.Height, MinWidth, MinHeight);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Photo validation failed: Unable to load image");
            return false;
        }

        return true;
    }

    public async Task<(string photoUrl, string thumbnailUrl)> SaveCoachPhotoAsync(IFormFile photo, int coachId)
    {
        // Validate photo first
        if (!await ValidatePhotoAsync(photo))
        {
            throw new InvalidOperationException("Photo validation failed");
        }

        // Create uploads directory if it doesn't exist
        var uploadsPath = Path.Combine(_environment.ContentRootPath, "uploads", "coaches");
        Directory.CreateDirectory(uploadsPath);

        // Generate unique filename
        var extension = Path.GetExtension(photo.FileName).ToLowerInvariant();
        var fileName = $"coach_{coachId}_{Guid.NewGuid()}{extension}";
        var thumbnailFileName = $"coach_{coachId}_{Guid.NewGuid()}_thumb{extension}";

        var photoPath = Path.Combine(uploadsPath, fileName);
        var thumbnailPath = Path.Combine(uploadsPath, thumbnailFileName);

        try
        {
            // Load and save original image (with optimization)
            using var stream = photo.OpenReadStream();
            using var image = await Image.LoadAsync(stream);
            
            // Optimize and save main image
            await image.SaveAsync(photoPath, new JpegEncoder { Quality = 85 });

            // Create and save thumbnail
            using var thumbnail = image.Clone(ctx => ctx.Resize(new ResizeOptions
            {
                Size = new Size(ThumbnailSize, ThumbnailSize),
                Mode = ResizeMode.Crop
            }));
            await thumbnail.SaveAsync(thumbnailPath, new JpegEncoder { Quality = 80 });

            // Return relative URLs
            var photoUrl = $"/uploads/coaches/{fileName}";
            var thumbnailUrl = $"/uploads/coaches/{thumbnailFileName}";

            _logger.LogInformation("Saved coach photo: {PhotoUrl}, thumbnail: {ThumbnailUrl}", photoUrl, thumbnailUrl);

            return (photoUrl, thumbnailUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save coach photo");
            
            // Clean up partial files
            if (File.Exists(photoPath))
                File.Delete(photoPath);
            if (File.Exists(thumbnailPath))
                File.Delete(thumbnailPath);
                
            throw;
        }
    }

    public async Task DeleteCoachPhotoAsync(int coachId)
    {
        var uploadsPath = Path.Combine(_environment.ContentRootPath, "uploads", "coaches");
        
        // Find all files for this coach
        if (Directory.Exists(uploadsPath))
        {
            var coachFiles = Directory.GetFiles(uploadsPath, $"coach_{coachId}_*");
            
            foreach (var file in coachFiles)
            {
                try
                {
                    File.Delete(file);
                    _logger.LogInformation("Deleted coach photo file: {File}", file);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to delete photo file: {File}", file);
                }
            }
        }
        
        await Task.CompletedTask;
    }
}
