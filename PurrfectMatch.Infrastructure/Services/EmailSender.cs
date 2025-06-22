using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using PurrfectMatch.Domain.Entities;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;


namespace PurrfectMatch.Infrastructure.Services
{
    public class EmailSender : IEmailSender<User>
    {
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUser;
        private readonly string _smtpPass;
        private readonly ILogger<EmailSender> _logger;
        private readonly EmailTemplateService _templateService;

        public EmailSender(IConfiguration configuration, ILogger<EmailSender> logger, EmailTemplateService templateService)
        {
            _smtpHost = configuration["EmailSettings:SmtpHost"] ?? "sandbox.smtp.mailtrap.io";
            _smtpPort = int.Parse(configuration["EmailSettings:SmtpPort"] ?? "587");
            _smtpUser = configuration["EmailSettings:SmtpUser"] ?? "670afe71355d1b";
            _smtpPass = configuration["EmailSettings:SmtpPass"] ?? "ec7076729334db";
            _logger = logger;
            _templateService = templateService;
        }        public async Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
        {
            var subject = "Welcome to Purrfect Match - Confirm Your Email! 🐾";
            var userName = !string.IsNullOrEmpty(user.UserName) ? user.UserName : "Pet Lover";
            var htmlMessage = _templateService.GetWelcomeEmailContent(userName, confirmationLink);

            await SendEmailAsync(email, subject, htmlMessage);
        }        public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
        {
            var subject = "Reset Your Purrfect Match Password 🔐";
            var htmlMessage = _templateService.GetPasswordResetEmailContent(resetLink);

            await SendEmailAsync(email, subject, htmlMessage);
        }        public async Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
        {
            var subject = "Your Purrfect Match Reset Code 🔑";
            var htmlMessage = _templateService.GetPasswordResetCodeEmailContent(resetCode);

            await SendEmailAsync(email, subject, htmlMessage);
        }        public async Task SendAdoptionNotificationAsync(User user, string email, string petName, string petType, string shelterName)
        {
            var subject = $"Update on Your Adoption Application for {petName} 🐾";
            var userName = !string.IsNullOrEmpty(user.UserName) ? user.UserName : "Pet Lover";
            var htmlMessage = _templateService.GetAdoptionNotificationEmailContent(userName, petName, petType, shelterName);

            await SendEmailAsync(email, subject, htmlMessage);
        }        public async Task SendGeneralNotificationAsync(User user, string email, string title, string message)
        {
            var subject = $"Purrfect Match - {title} 🐾";
            var userName = !string.IsNullOrEmpty(user.UserName) ? user.UserName : "Pet Lover";
            var htmlMessage = _templateService.GetGeneralNotificationEmailContent(userName, title, message);

            await SendEmailAsync(email, subject, htmlMessage);
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            using var client = new SmtpClient(_smtpHost, _smtpPort)
            {
                Credentials = new NetworkCredential(_smtpUser, _smtpPass),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 10000 // Increased timeout to 10 seconds
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("no-reply@purrfectmatch.com", "Purrfect Match"),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            try
            {
                await client.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent to {email} with subject: {subject}");
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, $"Failed to send email to {email}");
                throw; // Re-throw to let ASP.NET Core Identity handle the failure
            }
        }
    }
}