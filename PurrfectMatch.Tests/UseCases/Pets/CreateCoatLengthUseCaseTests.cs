using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.CoatLength;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class CreateCoatLengthUseCaseTests
    {
        [Fact]
        public async Task Execute_ShouldAddCoatLengthAndReturnDto()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<CoatLength>>();
            var mockMapper = new Mock<IMapper>();

            var coatLengthDto = new CoatLengthDto { Length = "Long" };
            var coatLength = new CoatLength { CoatLengthId = 1, Length = "Long" };

            mockMapper.Setup(m => m.Map<CoatLength>(coatLengthDto)).Returns(coatLength);
            mockMapper.Setup(m => m.Map<CoatLengthDto>(coatLength)).Returns(coatLengthDto);
            mockRepository.Setup(repo => repo.CreateAsync(coatLength)).Returns(Task.CompletedTask);
            mockRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var coatLengthsManager = new CoatLengthsManager(mockRepository.Object, mockMapper.Object);

            // Act
            var result = await coatLengthsManager.CreateCoatLengthAsync(coatLengthDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Long", result.Length);
            mockRepository.Verify(repo => repo.CreateAsync(coatLength), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}