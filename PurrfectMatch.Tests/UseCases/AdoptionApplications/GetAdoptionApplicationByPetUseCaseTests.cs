using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Application.Specifications.AdoptionApplications;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.AdoptionApplications;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.AdoptionApplications
{
    public class GetAdoptionApplicationByPetManagerTests
    {
        private readonly Mock<IBaseRepository<AdoptionApplication>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly AdoptionApplicationsManager _manager;        public GetAdoptionApplicationByPetManagerTests()
        {
            _repositoryMock = new Mock<IBaseRepository<AdoptionApplication>>();
            _mapperMock = new Mock<IMapper>();
            var petRepositoryMock = new Mock<IBaseRepository<Pet>>();
            var shelterManagerRepositoryMock = new Mock<IBaseRepository<ShelterManager>>();
            _manager = new AdoptionApplicationsManager(
                _repositoryMock.Object, 
                petRepositoryMock.Object, 
                shelterManagerRepositoryMock.Object, 
                _mapperMock.Object);
        }

        [Fact]
        public async Task GetAdoptionApplicationsByPetAsync_ReturnsMappedAdoptionApplications_WhenApplicationsExist()
        {
            // Arrange
            int petId = 1;
            var adoptionApplications = new List<AdoptionApplication>
            {
                new AdoptionApplication { ApplicationId = 1, PetId = petId },
                new AdoptionApplication { ApplicationId = 2, PetId = petId }
            };

            var adoptionApplicationDtos = new List<AdoptionApplicationDto>
            {
                new AdoptionApplicationDto { Id = 1, PetId = petId },
                new AdoptionApplicationDto { Id = 2, PetId = petId }
            };

            _repositoryMock.Setup(r => r.ListAsync(It.IsAny<AdoptionApplicationsByPetSpecification>()))
                .ReturnsAsync(adoptionApplications);
            _mapperMock.Setup(m => m.Map<IReadOnlyList<AdoptionApplicationDto>>(adoptionApplications))
                .Returns(adoptionApplicationDtos);

            // Act
            var result = await _manager.GetAdoptionApplicationsByPetAsync(petId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal(adoptionApplicationDtos, result);
        }

        [Fact]
        public async Task GetAdoptionApplicationsByPetAsync_ReturnsEmptyList_WhenNoApplicationsExist()
        {
            // Arrange
            int petId = 1;
            var adoptionApplications = new List<AdoptionApplication>();

            _repositoryMock.Setup(r => r.ListAsync(It.IsAny<AdoptionApplicationsByPetSpecification>()))
                .ReturnsAsync(adoptionApplications);
            _mapperMock.Setup(m => m.Map<IReadOnlyList<AdoptionApplicationDto>>(adoptionApplications))
                .Returns(new List<AdoptionApplicationDto>());

            // Act
            var result = await _manager.GetAdoptionApplicationsByPetAsync(petId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}