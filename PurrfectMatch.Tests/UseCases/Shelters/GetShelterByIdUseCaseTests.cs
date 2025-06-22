using System.Threading.Tasks;
using Moq;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Application.Managers;
using Xunit;
using Microsoft.AspNetCore.Identity;
using AutoMapper;

namespace PurrfectMatch.Tests.UseCases.Shelters
{
    public class GetShelterByIdUseCaseTests
    {
        private readonly Mock<IBaseRepository<Shelter>> _shelterRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IBaseRepository<Address>> _addressRepositoryMock;
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly AddressesManager _addressesManager;

        public GetShelterByIdUseCaseTests()
        {
            _shelterRepositoryMock = new Mock<IBaseRepository<Shelter>>();
            _mapperMock = new Mock<IMapper>();
            _addressRepositoryMock = new Mock<IBaseRepository<Address>>();
            
            // Create UserManager mock with proper dependencies
            _userManagerMock = new Mock<UserManager<User>>(
                Mock.Of<IUserStore<User>>(),
                null!, null!, null!, null!, null!, null!, null!, null!);
            
            // Create AddressesManager with proper dependencies
            _addressesManager = new AddressesManager(_addressRepositoryMock.Object, _mapperMock.Object);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnShelter_WhenShelterExists()
        {
            // Arrange
            var shelter = new Shelter { ShelterId = 1, Name = "Test Shelter" };
            _shelterRepositoryMock.Setup(repo => repo.GetAsync(1)).ReturnsAsync(shelter);

            var sheltersManager = new SheltersManager(
                _shelterRepositoryMock.Object,
                Mock.Of<IBaseRepository<ShelterCreationRequest>>(),
                Mock.Of<IBaseRepository<ShelterManager>>(),
                Mock.Of<IBaseSoftDeleteRepository<Shelter>>(),
                Mock.Of<IBaseRepository<Pet>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IFollowerRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IReviewRepository>(),
                _addressesManager,
                _userManagerMock.Object,
                _mapperMock.Object
            );

            // Act
            var result = await sheltersManager.GetShelterByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.ShelterId);
            Assert.Equal("Test Shelter", result.Name);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnNull_WhenShelterDoesNotExist()
        {
            // Arrange
            _shelterRepositoryMock.Setup(repo => repo.GetAsync(1)).ReturnsAsync((Shelter?)null);

            var sheltersManager = new SheltersManager(
                _shelterRepositoryMock.Object,
                Mock.Of<IBaseRepository<ShelterCreationRequest>>(),
                Mock.Of<IBaseRepository<ShelterManager>>(),
                Mock.Of<IBaseSoftDeleteRepository<Shelter>>(),
                Mock.Of<IBaseRepository<Pet>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IFollowerRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IReviewRepository>(),
                _addressesManager,
                _userManagerMock.Object,
                _mapperMock.Object
            );

            // Act
            var result = await sheltersManager.GetShelterByIdAsync(1);

            // Assert
            Assert.Null(result);
        }
    }
}