using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.IRepositories.Miscellaneous.Notifications;
using PurrfectMatch.Shared.DTOs.Notifications;

namespace PurrfectMatch.Application.Managers;

public class NotificationsManager
{
    private readonly IBaseRepository<Notification> _repository;
    private readonly IMapper _mapper;
    private readonly INotificationsRepository? _notificationsRepository;

    public NotificationsManager(
        IBaseRepository<Notification> repository,
        IMapper mapper,
        INotificationsRepository? notificationsRepository = null)
    {
        _repository = repository;
        _mapper = mapper;
        _notificationsRepository = notificationsRepository;
    }

    public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto createNotificationDto)
    {
        var notification = _mapper.Map<Notification>(createNotificationDto);
        await _repository.CreateAsync(notification);
        await _repository.SaveChangesAsync();
        return _mapper.Map<NotificationDto>(notification);
    }

    public async Task<bool> DeleteNotificationAsync(int notificationId)
    {
        var notification = await _repository.GetAsync(notificationId);
        if (notification == null) return false;
        _repository.Delete(notification);
        await _repository.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<NotificationDto>> GetAllNotificationsAsync()
    {
        var notifications = await _repository.ListAllAsync();
        return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
    }

    public async Task<Notification?> GetNotificationByIdAsync(int id)
    {
        return await _repository.GetAsync(id);
    }

    public async Task<IEnumerable<Notification>> GetNotificationsByUserIdAsync(string userId)
    {
        if (_notificationsRepository == null) throw new InvalidOperationException("NotificationsRepository not provided.");
        return await _notificationsRepository.GetNotificationsByUserIdAsync(userId);
    }

    public async Task<Notification?> UpdateNotificationAsync(int id, UpdateNotificationDto updateNotificationDto)
    {
        var notification = await _repository.GetAsync(id);
        if (notification == null) return null;
        _mapper.Map(updateNotificationDto, notification);
        _repository.Update(notification);
        await _repository.SaveChangesAsync();
        return notification;
    }
}
