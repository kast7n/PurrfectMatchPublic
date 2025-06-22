using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.ActivityLevels;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class ActivityLevelsManagerTests
    {
        [Fact]
        public async Task CreateActivityLevelAsync_ShouldAddActivityLevelAndReturnDto()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<ActivityLevel>>();
            var mockMapper = new Mock<IMapper>();

            var activityLevelDto = new ActivityLevelDto { Activity = "High" };
            var activityLevel = new ActivityLevel { ActivityLevelId = 1, Activity = "High" };

            mockMapper.Setup(m => m.Map<ActivityLevel>(activityLevelDto)).Returns(activityLevel);
            mockMapper.Setup(m => m.Map<ActivityLevelDto>(activityLevel)).Returns(activityLevelDto);
            mockRepository.Setup(repo => repo.CreateAsync(activityLevel)).Returns(Task.CompletedTask);
            mockRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var manager = new ActivityLevelsManager(mockRepository.Object, mockMapper.Object);

            // Act
            var result = await manager.CreateActivityLevelAsync(activityLevelDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("High", result.Activity);
            mockRepository.Verify(repo => repo.CreateAsync(activityLevel), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}