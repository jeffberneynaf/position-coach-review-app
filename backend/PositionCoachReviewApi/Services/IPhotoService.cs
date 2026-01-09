namespace PositionCoachReviewApi.Services;

public interface IPhotoService
{
    Task<(string photoUrl, string thumbnailUrl)> SaveCoachPhotoAsync(IFormFile photo, int coachId);
    Task<bool> ValidatePhotoAsync(IFormFile photo);
    Task DeleteCoachPhotoAsync(int coachId);
}
