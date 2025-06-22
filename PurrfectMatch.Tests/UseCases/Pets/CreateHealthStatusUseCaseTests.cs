using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.HealthStatuses;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class CreateHealthStatusUseCaseTests
    {
        [Fact]
        public async Task Execute_ShouldAddHealthStatusAndReturnDto()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<HealthStatus>>();
            var mockMapper = new Mock<IMapper>();

            var healthStatusDto = new HealthStatusDto { Status = "Healthy" };
            var healthStatus = new HealthStatus { HealthStatusId = 1, Status = "Healthy" };

            mockMapper.Setup(m => m.Map<HealthStatus>(healthStatusDto)).Returns(healthStatus);
            mockMapper.Setup(m => m.Map<HealthStatusDto>(healthStatus)).Returns(healthStatusDto);
            mockRepository.Setup(repo => repo.CreateAsync(healthStatus)).Returns(Task.CompletedTask);
            mockRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var healthStatusesManager = new HealthStatusesManager(mockRepository.Object, mockMapper.Object);

            // Act
            var result = await healthStatusesManager.CreateHealthStatusAsync(healthStatusDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Healthy", result.Status);
            mockRepository.Verify(repo => repo.CreateAsync(healthStatus), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}