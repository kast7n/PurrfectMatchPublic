using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds;
using AutoMapper;
using Moq;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Application.Managers.Pets.Attributes;

namespace PurrfectMatch.Tests.UseCases
{
    public class FilterManagerTests
    {
        private readonly Mock<IBaseRepository<Breed>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;

        public FilterManagerTests()
        {
            _repositoryMock = new Mock<IBaseRepository<Breed>>();
            _mapperMock = new Mock<IMapper>();
        }

        [Fact]
        public async Task FilterManager_ShouldReturnFilteredBreeds()
        {
            // Arrange
            var filterDto = new BreedFilterDto { Name = "Persian" };
            var breeds = new List<Breed>
            {
                new Breed { BreedId = 1, Name = "Persian", SpeciesId = 2 },
                new Breed { BreedId = 2, Name = "Siamese", SpeciesId = 2 }
            };
            var filteredBreeds = new List<Breed>
            {
                new Breed { BreedId = 1, Name = "Persian", SpeciesId = 2 }
            };
            var filteredBreedDtos = new List<BreedDto>
            {
                new BreedDto { BreedId = 1, Name = "Persian", SpeciesId = 2 }
            };

            _repositoryMock.Setup(r => r.ListAsync(It.IsAny<ISpecification<Breed>>()))
                .ReturnsAsync(filteredBreeds);
            _mapperMock.Setup(m => m.Map<IEnumerable<BreedDto>>(It.IsAny<List<Breed>>()))
                .Returns(filteredBreedDtos);

            var breedsManager = new BreedsManager(_repositoryMock.Object, _mapperMock.Object);

            // Act
            var result = await breedsManager.GetBreedsAsync(filterDto);
            var resultList = result.ToList();

            // Assert
            Assert.NotNull(resultList);
            Assert.Single(resultList);
            Assert.Equal("Persian", resultList[0].Name);
        }
    }
}