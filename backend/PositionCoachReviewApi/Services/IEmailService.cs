namespace PositionCoachReviewApi.Services;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string toEmail, string firstName, string verificationToken, string userType);
    Task SendWelcomeEmailAsync(string toEmail, string firstName);
}
