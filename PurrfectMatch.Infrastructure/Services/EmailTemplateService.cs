using Microsoft.Extensions.Configuration;
using System.Text;

namespace PurrfectMatch.Infrastructure.Services
{
    public class EmailTemplateService
    {
        private readonly string _logoUrl;
        private readonly string _frontendBaseUrl;

        public EmailTemplateService(IConfiguration configuration)
        {
            _logoUrl = "https://purrfectmatchstore.blob.core.windows.net/email-images/PurffectMatchLogo.webp";
            _frontendBaseUrl = configuration["Frontend:BaseUrl"] ?? "https://localhost:3000";
        }

        public string GetBaseTemplate(string title, string content, string? ctaText = null, string? ctaUrl = null)
        {
            var template = new StringBuilder();
            
            template.Append(@"
<!DOCTYPE html>
<html lang=""en"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>").Append(title).Append(@"</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background-color: #f7f3f0;
            color: #5d4e37;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #ff6b6b, #ffa726);
            padding: 30px 20px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('data:image/svg+xml,<svg xmlns=""http://www.w3.org/2000/svg"" viewBox=""0 0 100 100""><defs><pattern id=""pawprint"" x=""0"" y=""0"" width=""50"" height=""50"" patternUnits=""userSpaceOnUse""><circle cx=""10"" cy=""15"" r=""3"" fill=""rgba(255,255,255,0.1)""/><circle cx=""25"" cy=""10"" r=""3"" fill=""rgba(255,255,255,0.1)""/><circle cx=""40"" cy=""15"" r=""3"" fill=""rgba(255,255,255,0.1)""/><ellipse cx=""25"" cy=""30"" rx=""8"" ry=""6"" fill=""rgba(255,255,255,0.1)""/></pattern></defs><rect width=""100"" height=""100"" fill=""url(%23pawprint)""/></svg>');
            opacity: 0.3;
        }
        
        .logo {
            max-width: 180px;
            height: auto;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .header-title {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        
        .content h1 {
            color: #ff6b6b;
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .content h2 {
            color: #5d4e37;
            font-size: 20px;
            margin-bottom: 15px;
        }
        
        .content p {
            margin-bottom: 15px;
            font-size: 16px;
            line-height: 1.8;
        }
        
        .cta-button {
            display: inline-block;
            padding: 15px 30px;
            background: linear-gradient(135deg, #ff6b6b, #ffa726);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(255, 107, 107, 0.6);
        }
        
        .cta-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .divider {
            height: 2px;
            background: linear-gradient(to right, transparent, #ff6b6b, transparent);
            margin: 30px 0;
        }
        
        .footer {
            background-color: #5d4e37;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        
        .footer p {
            margin-bottom: 10px;
            font-size: 14px;
        }
        
        .footer .social-links {
            margin: 20px 0;
        }
        
        .footer .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #ffa726;
            text-decoration: none;
            font-weight: bold;
        }
        
        .paw-decoration {
            text-align: center;
            font-size: 24px;
            color: #ff6b6b;
            margin: 20px 0;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 167, 38, 0.1));
            border-left: 4px solid #ff6b6b;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 10px 10px 0;
        }
        
        .code-display {
            background-color: #f8f9fa;
            border: 2px solid #ff6b6b;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            color: #5d4e37;
            letter-spacing: 2px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 10px;
            }
            
            .content {
                padding: 20px 15px;
            }
            
            .header {
                padding: 20px 15px;
            }
            
            .logo {
                max-width: 150px;
            }
            
            .header-title {
                font-size: 24px;
            }
            
            .content h1 {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class=""email-container"">
        <div class=""header"">
            <img src=""").Append(_logoUrl).Append(@""" alt=""Purrfect Match Logo"" class=""logo"">
            <h1 class=""header-title"">").Append(title).Append(@"</h1>
        </div>
        
        <div class=""content"">
            ").Append(content);

            if (!string.IsNullOrEmpty(ctaText) && !string.IsNullOrEmpty(ctaUrl))
            {
                template.Append(@"
            <div class=""cta-container"">
                <a href=""").Append(ctaUrl).Append(@""" class=""cta-button"">").Append(ctaText).Append(@"</a>
            </div>");
            }

            template.Append(@"
            <div class=""paw-decoration"">🐾 🐾 🐾</div>
        </div>
        
        <div class=""footer"">
            <p><strong>Purrfect Match - Connecting Hearts, One Paw at a Time</strong></p>
            <p>Finding loving homes for furry friends since day one!</p>
            <div class=""social-links"">
                <a href=""").Append(_frontendBaseUrl).Append(@""">Visit Our Website</a> |
                <a href=""").Append(_frontendBaseUrl).Append(@"/contact"">Contact Us</a>
            </div>
            <p style=""font-size: 12px; color: #cccccc; margin-top: 20px;"">
                This email was sent to you because you're part of our Purrfect Match family.<br>
                If you no longer wish to receive these emails, please contact us.
            </p>
        </div>
    </div>
</body>
</html>");

            return template.ToString();
        }

        public string GetWelcomeEmailContent(string userName, string confirmationLink)
        {
            var content = $@"
                <h1>Welcome to Our Pet Family! 🎉</h1>
                <p>Dear {userName},</p>
                <p>We're absolutely <strong>thrilled</strong> to have you join the Purrfect Match community! You've just taken the first step toward finding your perfect furry companion.</p>
                
                <div class=""highlight-box"">
                    <p><strong>🏠 What awaits you:</strong></p>
                    <ul style=""margin: 10px 0; padding-left: 20px;"">
                        <li>Browse adorable pets looking for their forever homes</li>
                        <li>Connect with local shelters and rescue organizations</li>
                        <li>Get personalized pet recommendations</li>
                        <li>Access our adoption guidance and resources</li>
                    </ul>
                </div>
                
                <p>To get started and unlock all features, please confirm your email address by clicking the button below:</p>
                
                <div class=""divider""></div>
                
                <p style=""text-align: center; font-size: 14px; color: #888;"">
                    Didn't request this account? You can safely ignore this email.
                </p>";

            return GetBaseTemplate("Welcome to Purrfect Match!", content, "Confirm My Email", confirmationLink);
        }

        public string GetPasswordResetEmailContent(string resetLink)
        {
            var content = $@"
                <h1>Password Reset Request 🔐</h1>
                <p>Woof! It looks like you need to reset your Purrfect Match password.</p>
                <p>Don't worry - it happens to the best of us! Click the button below to create a new password and get back to finding your perfect pet match.</p>
                
                <div class=""highlight-box"">
                    <p><strong>🛡️ Security Note:</strong></p>
                    <p>This reset link will expire in 24 hours for your security. If you didn't request this reset, you can safely ignore this email - your account remains secure.</p>
                </div>
                
                <div class=""divider""></div>
                
                <p style=""text-align: center; font-size: 14px; color: #888;"">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <span style=""color: #ff6b6b; word-break: break-all;"">{resetLink}</span>
                </p>";

            return GetBaseTemplate("Reset Your Password", content, "Reset My Password", resetLink);
        }

        public string GetPasswordResetCodeEmailContent(string resetCode)
        {
            var content = $@"
                <h1>Your Password Reset Code 🔑</h1>
                <p>Here's your password reset code for Purrfect Match:</p>
                
                <div class=""code-display"">
                    {resetCode}
                </div>
                
                <div class=""highlight-box"">
                    <p><strong>📱 How to use this code:</strong></p>
                    <ol style=""margin: 10px 0; padding-left: 20px;"">
                        <li>Return to the Purrfect Match app</li>
                        <li>Enter this code when prompted</li>
                        <li>Create your new password</li>
                        <li>Get back to finding your furry friend!</li>
                    </ol>
                </div>
                
                <p><strong>⏰ Important:</strong> This code will expire in 15 minutes for your security.</p>
                
                <div class=""divider""></div>
                
                <p style=""text-align: center; font-size: 14px; color: #888;"">
                    Didn't request this code? Please contact our support team immediately.
                </p>";

            return GetBaseTemplate("Your Reset Code", content);
        }

        public string GetAdoptionNotificationEmailContent(string userName, string petName, string petType, string shelterName)
        {
            var content = $@"
                <h1>Exciting News About Your Application! 🎉</h1>
                <p>Dear {userName},</p>
                <p>We have an update regarding your adoption application for <strong>{petName}</strong>, the adorable {petType} from {shelterName}!</p>
                
                <div class=""highlight-box"">
                    <p><strong>📋 Next Steps:</strong></p>
                    <p>The shelter will be in touch with you soon to discuss the next steps in the adoption process. This is so exciting!</p>
                </div>
                
                <p>Thank you for choosing to adopt and give a loving animal a forever home. You're making a real difference! 🏠❤️</p>
                
                <div class=""divider""></div>
                
                <p style=""text-align: center; font-style: italic; color: #666;"">
                    ""Until one has loved an animal, a part of one's soul remains unawakened.""<br>
                    - Anatole France
                </p>";

            return GetBaseTemplate("Adoption Application Update", content, "View My Applications", $"{_frontendBaseUrl}/applications");
        }

        public string GetGeneralNotificationEmailContent(string userName, string title, string message)
        {
            var content = $@"
                <h1>{title}</h1>
                <p>Dear {userName},</p>
                <p>{message}</p>
                
                <div class=""highlight-box"">
                    <p><strong>🔔 Stay Connected:</strong></p>
                    <p>Log in to your Purrfect Match account to see all your notifications and stay up to date with your pet adoption journey!</p>
                </div>
                
                <div class=""divider""></div>";

            return GetBaseTemplate(title, content, "View Dashboard", $"{_frontendBaseUrl}/dashboard");
        }
    }
}
