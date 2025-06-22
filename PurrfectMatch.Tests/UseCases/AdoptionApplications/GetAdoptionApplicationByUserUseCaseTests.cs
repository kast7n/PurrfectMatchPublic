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
    public class GetAdoptionApplicationByUserManagerTests
    {
        private readonly Mock<IBaseRepository<AdoptionApplication>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly AdoptionApplicationsManager _manager;        public GetAdoptionApplicationByUserManagerTests()
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
        public async Task GetAdoptionApplicationsByUserAsync_ReturnsMappedAdoptionApplications_WhenApplicationsExist()
        {
            // Arrange
            string userId = "user123";
            var adoptionApplications = new List<AdoptionApplication>
            {
                new AdoptionApplication { ApplicationId = 1, UserId = userId },
                new AdoptionApplication { ApplicationId = 2, UserId = userId }
            };

            var adoptionApplicationDtos = new List<AdoptionApplicationDto>
            {
                new AdoptionApplicationDto { Id = 1, UserId = userId },
                new AdoptionApplicationDto { Id = 2, UserId = userId }
            };

            _repositoryMock.Setup(r => r.ListAsync(It.IsAny<AdoptionApplicationsByUserSpecification>()))
                .ReturnsAsync(adoptionApplications);
            _mapperMock.Setup(m => m.Map<IReadOnlyList<AdoptionApplicationDto>>(adoptionApplications))
                .Returns(adoptionApplicationDtos);

            // Act
            var result = await _manager.GetAdoptionApplicationsByUserAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal(adoptionApplicationDtos, result);
        }

        [Fact]
        public async Task GetAdoptionApplicationsByUserAsync_ReturnsEmptyList_WhenNoApplicationsExist()
        {
            // Arrange
            string userId = "user123";
            var adoptionApplications = new List<AdoptionApplication>();

            _repositoryMock.Setup(r => r.ListAsync(It.IsAny<AdoptionApplicationsByUserSpecification>()))
                .ReturnsAsync(adoptionApplications);
            _mapperMock.Setup(m => m.Map<IReadOnlyList<AdoptionApplicationDto>>(adoptionApplications))
                .Returns(new List<AdoptionApplicationDto>());

            // Act
            var result = await _manager.GetAdoptionApplicationsByUserAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}