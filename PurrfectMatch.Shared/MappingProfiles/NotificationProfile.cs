using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Shared.DTOs.Notifications;

namespace PurrfectMatch.Shared.MappingProfiles
{
    public class NotificationProfile : Profile
    {
        public NotificationProfile()
        {
            // Map from CreateNotificationDto to Notification entity for creating
            CreateMap<CreateNotificationDto, Notification>()
                .ForMember(dest => dest.NotificationId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());

            // Map from Notification entity to NotificationDto for returning data
            CreateMap<Notification, NotificationDto>()
                .ForMember(dest => dest.NotificationId, opt => opt.MapFrom(src => src.NotificationId))
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.NotificationType, opt => opt.MapFrom(src => src.NotificationType))
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Message, opt => opt.MapFrom(src => src.Message))
                .ForMember(dest => dest.IsRead, opt => opt.MapFrom(src => src.IsRead))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.ActionUrl, opt => opt.MapFrom(src => src.ActionUrl));

            // Map for updating notifications
            CreateMap<UpdateNotificationDto, Notification>()
                .ForMember(dest => dest.NotificationId, opt => opt.Ignore())
                .ForMember(dest => dest.UserId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
