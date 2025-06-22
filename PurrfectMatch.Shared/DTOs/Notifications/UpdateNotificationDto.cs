using System;
using System.ComponentModel.DataAnnotations;

namespace PurrfectMatch.Shared.DTOs.Notifications;

public class UpdateNotificationDto
{
    public int NotificationId { get; set; }

    public string? Title { get; set; }

    public string? Message { get; set; }

    public DateTime Date { get; set; }

    public bool IsRead { get; set; }
}
