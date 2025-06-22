using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Species;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class CreateSpeciesUseCaseTests
    {
        [Fact]
        public async Task Execute_ShouldAddSpeciesAndReturnDto()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Species>>();
            var mockMapper = new Mock<IMapper>();

            var speciesDto = new SpeciesDto { Name = "Dog" };
            var species = new Species { SpeciesId = 1, Name = "Dog" };

            mockMapper.Setup(m => m.Map<Species>(speciesDto)).Returns(species);
            mockMapper.Setup(m => m.Map<SpeciesDto>(species)).Returns(speciesDto);
            mockRepository.Setup(repo => repo.CreateAsync(species)).Returns(Task.CompletedTask);
            mockRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var speciesManager = new SpeciesManager(mockRepository.Object, mockMapper.Object);

            // Act
            var result = await speciesManager.CreateSpeciesAsync(speciesDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Dog", result.Name);
            mockRepository.Verify(repo => repo.CreateAsync(species), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}