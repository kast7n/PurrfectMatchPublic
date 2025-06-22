using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class CreateBreedUseCaseTests
    {
        [Fact]
        public async Task Execute_ShouldAddBreedAndReturnDto()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Breed>>();
            var mockMapper = new Mock<IMapper>();

            var breedDto = new BreedDto { Name = "Golden Retriever" };
            var breed = new Breed { BreedId = 1, Name = "Golden Retriever" };

            mockMapper.Setup(m => m.Map<Breed>(breedDto)).Returns(breed);
            mockMapper.Setup(m => m.Map<BreedDto>(breed)).Returns(breedDto);
            mockRepository.Setup(repo => repo.CreateAsync(breed)).Returns(Task.CompletedTask);
            mockRepository.Setup(repo => repo.SaveChangesAsync()).Returns(Task.CompletedTask);

            var breedsManager = new BreedsManager(mockRepository.Object, mockMapper.Object);

            // Act
            var result = await breedsManager.CreateBreedAsync(breedDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Golden Retriever", result.Name);
            mockRepository.Verify(repo => repo.CreateAsync(breed), Times.Once);
            mockRepository.Verify(repo => repo.SaveChangesAsync(), Times.Once);
        }
    }
}