namespace PurrfectMatch.Application.Interfaces.Services
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(string userId, string notificationType, string title, string message, string? actionUrl = null);
    }
}