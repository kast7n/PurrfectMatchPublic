using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Application.Interfaces.Services;

public interface IEmailSender
{
    Task SendEmailAsync(string email, string subject, string htmlMessage);
    Task SendAdoptionNotificationAsync(User user, string email, string petName, string petType, string shelterName);
    Task SendGeneralNotificationAsync(User user, string email, string title, string message);
}
