using System;
using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Shared.DTOs.Notifications;
using AutoMapper;
using PurrfectMatch.Application.Interfaces.Services;

namespace PurrfectMatch.Api.Controllers;

public class NotificationsController(
    NotificationsManager notificationsManager,
    IMapper mapper,
    ISignalRNotificationService signalRService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var notifications = await notificationsManager.GetAllNotificationsAsync();
        var notificationDtos = notifications.Select(n => mapper.Map<NotificationDto>(n));
        return Ok(notificationDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var notification = await notificationsManager.GetNotificationByIdAsync(id);
        if (notification == null) return NotFound();
        var notificationDto = mapper.Map<NotificationDto>(notification);
        return Ok(notificationDto);
    }    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateNotificationDto notificationDto)
    {
        var notification = await notificationsManager.CreateNotificationAsync(notificationDto);
        
        // Send real-time notification
        await signalRService.SendNotificationToUserAsync(notification.UserId!, notification);
        
        return CreatedAtAction(nameof(GetNotifications), new { id = notification.NotificationId }, notification);
    }    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateNotificationDto updateNotificationDto)
    {
        var notification = await notificationsManager.UpdateNotificationAsync(id, updateNotificationDto);
        if (notification == null) return NotFound();
        var notificationDto = mapper.Map<NotificationDto>(notification);
        
        // Send real-time notification update
        await signalRService.NotifyNotificationUpdatedAsync(notification.UserId, notificationDto);
        
        return Ok(notificationDto);
    }    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // Get the notification before deleting to get the userId
        var notification = await notificationsManager.GetNotificationByIdAsync(id);
        if (notification == null) return NotFound();
        
        var success = await notificationsManager.DeleteNotificationAsync(id);
        if (!success) return NotFound();
        
        // Send real-time notification deletion
        await signalRService.NotifyNotificationDeletedAsync(notification.UserId, id);
        
        return NoContent();
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetNotificationsByUserId(string userId)
    {
        var notifications = await notificationsManager.GetNotificationsByUserIdAsync(userId);
        var notificationDtos = notifications.Select(n => mapper.Map<NotificationDto>(n));
        return Ok(notificationDtos);
    }    [HttpPost("{id}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var updateDto = new UpdateNotificationDto { IsRead = true };
        var notification = await notificationsManager.UpdateNotificationAsync(id, updateDto);
        if (notification == null) return NotFound();
        var notificationDto = mapper.Map<NotificationDto>(notification);
        
        // Send real-time notification update
        await signalRService.NotifyNotificationUpdatedAsync(notification.UserId, notificationDto);
        
        return Ok(notificationDto);
    }    // Test endpoint for SignalR integration
    [HttpPost("test/{userId}")]
    public async Task<IActionResult> TestNotification(string userId, [FromQuery] string? message = null)
    {
        var testNotificationDto = new CreateNotificationDto
        {
            Title = "Test Notification",
            Message = message ?? "Test notification from SignalR",
            NotificationType = "GeneralUpdate",
            CreatedAt = DateTime.UtcNow
        };

        var notification = await notificationsManager.CreateNotificationAsync(testNotificationDto);
        
        // Manually set the UserId since it's not in the CreateNotificationDto
        var notificationWithUserId = await notificationsManager.GetNotificationByIdAsync(notification.NotificationId);
        if (notificationWithUserId != null)
        {
            // Update the notification with the userId
            notificationWithUserId.UserId = userId;
            await notificationsManager.UpdateNotificationAsync(notification.NotificationId, new UpdateNotificationDto());
            
            // Get the updated notification as DTO
            var notificationDto = mapper.Map<NotificationDto>(notificationWithUserId);
            notificationDto.UserId = userId; // Ensure UserId is set
            
            // Send real-time notification
            await signalRService.SendNotificationToUserAsync(userId, notificationDto);
            
            return Ok(new { message = "Test notification sent!", notification = notificationDto });
        }

        return BadRequest("Failed to create test notification");
    }
}
