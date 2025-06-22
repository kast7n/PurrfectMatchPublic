using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Specifications.PetSpecifications;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets;
using PurrfectMatch.Shared.DTOs.Shelters;
using PurrfectMatch.Application.Managers;
using Xunit;
using Microsoft.AspNetCore.Identity;

namespace PurrfectMatch.Tests.UseCases.Shelters
{    public class GetShelterMetricsUseCaseTests
    {
        private readonly Mock<IBaseRepository<Shelter>> _shelterRepositoryMock;
        private readonly Mock<IBaseRepository<Pet>> _petRepositoryMock;
        private readonly Mock<IFollowerRepository> _followerRepositoryMock;
        private readonly Mock<IReviewRepository> _reviewRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IBaseRepository<Address>> _addressRepositoryMock;
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly AddressesManager _addressesManager;
        private readonly SheltersManager _sheltersManager;

        public GetShelterMetricsUseCaseTests()
        {
            _shelterRepositoryMock = new Mock<IBaseRepository<Shelter>>();
            _petRepositoryMock = new Mock<IBaseRepository<Pet>>();
            _followerRepositoryMock = new Mock<IFollowerRepository>();
            _reviewRepositoryMock = new Mock<IReviewRepository>();
            _mapperMock = new Mock<IMapper>();
            _addressRepositoryMock = new Mock<IBaseRepository<Address>>();
            
            // Create UserManager mock with proper dependencies
            _userManagerMock = new Mock<UserManager<User>>(
                Mock.Of<IUserStore<User>>(),
                null!, null!, null!, null!, null!, null!, null!, null!);
            
            // Create AddressesManager with proper dependencies
            _addressesManager = new AddressesManager(_addressRepositoryMock.Object, _mapperMock.Object);
            
            _sheltersManager = new SheltersManager(
                _shelterRepositoryMock.Object,
                Mock.Of<IBaseRepository<ShelterCreationRequest>>(),
                Mock.Of<IBaseRepository<ShelterManager>>(),
                Mock.Of<IBaseSoftDeleteRepository<Shelter>>(),
                _petRepositoryMock.Object,
                _followerRepositoryMock.Object,
                _reviewRepositoryMock.Object,
                _addressesManager,                _userManagerMock.Object,
                _mapperMock.Object
            );
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnNull_WhenShelterDoesNotExist()
        {
            // Arrange
            var shelterId = 1;
            _shelterRepositoryMock.Setup(repo => repo.GetAsync(shelterId)).ReturnsAsync((Shelter?)null);

            // Act
            var result = await _sheltersManager.GetShelterMetricsAsync(shelterId);

            // Assert
            Assert.Null(result);
        }
    }
}