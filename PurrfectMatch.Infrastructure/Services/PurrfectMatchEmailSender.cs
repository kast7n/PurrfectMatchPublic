using Microsoft.AspNetCore.Identity;
using PurrfectMatch.Application.Interfaces.Services;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Infrastructure.Services
{
    public class PurrfectMatchEmailSender : PurrfectMatch.Application.Interfaces.Services.IEmailSender
    {
        private readonly EmailSender _emailSender;

        public PurrfectMatchEmailSender(EmailSender emailSender)
        {
            _emailSender = emailSender;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            await _emailSender.SendEmailAsync(email, subject, htmlMessage);
        }        public async Task SendAdoptionNotificationAsync(User user, string email, string petName, string petType, string shelterName)
        {
            await _emailSender.SendAdoptionNotificationAsync(user, email, petName, petType, shelterName);
        }

        public async Task SendGeneralNotificationAsync(User user, string email, string title, string message)
        {
            await _emailSender.SendGeneralNotificationAsync(user, email, title, message);
        }
    }
}
