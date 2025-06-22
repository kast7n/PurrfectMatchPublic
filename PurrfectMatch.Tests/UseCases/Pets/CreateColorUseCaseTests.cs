using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Colors;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class CreateColorUseCaseTests
    {
        [Fact]
        public async Task Execute_ShouldAddColorAndReturnDto()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Color>>();
            var mockMapper = new Mock<IMapper>();

            var colorDto = new ColorDto { Color1 = "Brown" };
            var color = new Color { ColorId = 1, Color1 = "Brown" };

            mockMapper.Setup(m => m.Map<Color>(colorDto)).Returns(color);
            mockMapper.Setup(m => m.Map<ColorDto>(color)).Returns(colorDto);
            mockRepository.Setup(repo => repo.CreateAsync(color)).Returns(Task.CompletedTask);
            mockRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var colorsManager = new ColorsManager(mockRepository.Object, mockMapper.Object);

            // Act
            var result = await colorsManager.CreateColorAsync(colorDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Brown", result.Color1);
            mockRepository.Verify(repo => repo.CreateAsync(color), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}