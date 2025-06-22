using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.AdoptionApplications;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.AdoptionApplications
{
    public class GetAllAdoptionApplicationsManagerTests
    {
        private readonly Mock<IBaseRepository<AdoptionApplication>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly AdoptionApplicationsManager _manager;        public GetAllAdoptionApplicationsManagerTests()
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
        public async Task GetAllAdoptionApplicationsAsync_ReturnsMappedAdoptionApplications()
        {
            // Arrange
            var adoptionApplications = new List<AdoptionApplication>
            {
                new AdoptionApplication { ApplicationId = 1 },
                new AdoptionApplication { ApplicationId = 2 }
            };

            var adoptionApplicationDtos = new List<AdoptionApplicationDto>
            {
                new AdoptionApplicationDto { Id = 1 },
                new AdoptionApplicationDto { Id = 2 }
            };

            _repositoryMock.Setup(r => r.ListAllAsync()).ReturnsAsync(adoptionApplications);
            _mapperMock.Setup(m => m.Map<IReadOnlyList<AdoptionApplicationDto>>(adoptionApplications)).Returns(adoptionApplicationDtos);

            // Act
            var result = await _manager.GetAllAdoptionApplicationsAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal(1, result[0].Id);
            Assert.Equal(2, result[1].Id);
        }
    }
}