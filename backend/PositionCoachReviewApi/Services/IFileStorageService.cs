namespace PositionCoachReviewApi.Services;

public interface IFileStorageService
{
    Task<string> SaveProfilePhotoAsync(IFormFile file, int coachId);
    void DeleteProfilePhoto(string? photoUrl);
    bool IsValidImageFile(IFormFile file);
    bool IsValidFileSize(IFormFile file, long maxSizeInBytes);
}
