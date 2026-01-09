namespace PositionCoachReviewApi.Services;

public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FileStorageService> _logger;
    private const long MaxFileSizeBytes = 2 * 1024 * 1024; // 2MB
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/png", "image/gif", "image/webp" };

    public FileStorageService(IWebHostEnvironment environment, ILogger<FileStorageService> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    public bool IsValidImageFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return false;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            return false;

        if (!AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            return false;

        return true;
    }

    public bool IsValidFileSize(IFormFile file, long maxSizeInBytes)
    {
        return file != null && file.Length > 0 && file.Length <= maxSizeInBytes;
    }

    public async Task<string> SaveProfilePhotoAsync(IFormFile file, int coachId)
    {
        if (!IsValidImageFile(file))
        {
            throw new ArgumentException("Invalid image file type");
        }

        if (!IsValidFileSize(file, MaxFileSizeBytes))
        {
            throw new ArgumentException($"File size must be less than {MaxFileSizeBytes / 1024 / 1024}MB");
        }

        // Create uploads directory if it doesn't exist
        var uploadsPath = Path.Combine(_environment.ContentRootPath, "uploads", "profile-photos");
        Directory.CreateDirectory(uploadsPath);

        // Generate unique filename with sanitization
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var fileName = $"coach_{coachId}_{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        try
        {
            // Save the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative URL path
            return $"/uploads/profile-photos/{fileName}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving profile photo for coach {CoachId}", coachId);
            throw new InvalidOperationException("Failed to save profile photo", ex);
        }
    }

    public void DeleteProfilePhoto(string? photoUrl)
    {
        if (string.IsNullOrEmpty(photoUrl))
            return;

        try
        {
            // Extract filename from URL
            var fileName = Path.GetFileName(photoUrl);
            var filePath = Path.Combine(_environment.ContentRootPath, "uploads", "profile-photos", fileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                _logger.LogInformation("Deleted profile photo: {FilePath}", filePath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting profile photo: {PhotoUrl}", photoUrl);
            // Don't throw - deletion failure shouldn't break the application
        }
    }
}
