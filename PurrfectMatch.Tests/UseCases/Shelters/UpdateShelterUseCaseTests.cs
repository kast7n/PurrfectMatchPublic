using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Shelters;
using AutoMapper;
using Moq;
using Xunit;
using System.Threading.Tasks;
using PurrfectMatch.Application.Managers;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace PurrfectMatch.Tests.UseCases.Shelters
{
    public class UpdateShelterUseCaseTests
    {
        private readonly Mock<IBaseRepository<Shelter>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;

        public UpdateShelterUseCaseTests()
        {
            _repositoryMock = new Mock<IBaseRepository<Shelter>>();
            _mapperMock = new Mock<IMapper>();
        }

        [Fact]
        public async Task ExecuteAsync_ShouldUpdateShelter_WhenShelterExists()
        {
            // Arrange
            var shelterId = 1;
            var updateDto = new UpdateShelterDto { Name = "Updated Shelter" };
            var existingShelter = new Shelter { ShelterId = shelterId, Name = "Old Shelter" };

            _repositoryMock.Setup(r => r.GetAsync(shelterId)).ReturnsAsync(existingShelter);
            _mapperMock.Setup(m => m.Map(updateDto, existingShelter));            _repositoryMock.Setup(r => r.Update(existingShelter)).Callback(() =>
            {
                existingShelter.Name = updateDto.Name;
            });

            var addressesManagerMock = new Mock<AddressesManager>(
                Mock.Of<IBaseRepository<Address>>(), 
                Mock.Of<IMapper>()
            ) { CallBase = false };

            var userStoreMock = new Mock<IUserStore<User>>();
            var userManagerMock = new Mock<UserManager<User>>(
                userStoreMock.Object,
                Mock.Of<IOptions<IdentityOptions>>(),
                Mock.Of<IPasswordHasher<User>>(),
                new IUserValidator<User>[0],
                new IPasswordValidator<User>[0],
                Mock.Of<ILookupNormalizer>(),
                Mock.Of<IdentityErrorDescriber>(),
                Mock.Of<IServiceProvider>(),
                Mock.Of<ILogger<UserManager<User>>>()
            ) { CallBase = false };

            var sheltersManager = new SheltersManager(
                _repositoryMock.Object,
                Mock.Of<IBaseRepository<ShelterCreationRequest>>(),
                Mock.Of<IBaseRepository<ShelterManager>>(),
                Mock.Of<IBaseSoftDeleteRepository<Shelter>>(),
                Mock.Of<IBaseRepository<Pet>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IFollowerRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IReviewRepository>(),
                addressesManagerMock.Object,
                userManagerMock.Object,
                _mapperMock.Object
            );

            // Act
            var result = await sheltersManager.UpdateShelterAsync(shelterId, updateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Shelter", result.Name);
            _repositoryMock.Verify(r => r.Update(existingShelter), Times.Once);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldReturnNull_WhenShelterDoesNotExist()
        {
            // Arrange
            var shelterId = 1;
            var updateDto = new UpdateShelterDto { Name = "Updated Shelter" };            _repositoryMock.Setup(r => r.GetAsync(shelterId)).ReturnsAsync((Shelter?)null);

            var addressesManagerMock = new Mock<AddressesManager>(
                Mock.Of<IBaseRepository<Address>>(), 
                Mock.Of<IMapper>()
            ) { CallBase = false };

            var userStoreMock = new Mock<IUserStore<User>>();
            var userManagerMock = new Mock<UserManager<User>>(
                userStoreMock.Object,
                Mock.Of<IOptions<IdentityOptions>>(),
                Mock.Of<IPasswordHasher<User>>(),
                new IUserValidator<User>[0],
                new IPasswordValidator<User>[0],
                Mock.Of<ILookupNormalizer>(),
                Mock.Of<IdentityErrorDescriber>(),
                Mock.Of<IServiceProvider>(),
                Mock.Of<ILogger<UserManager<User>>>()
            ) { CallBase = false };

            var sheltersManager = new SheltersManager(
                _repositoryMock.Object,
                Mock.Of<IBaseRepository<ShelterCreationRequest>>(),
                Mock.Of<IBaseRepository<ShelterManager>>(),
                Mock.Of<IBaseSoftDeleteRepository<Shelter>>(),
                Mock.Of<IBaseRepository<Pet>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IFollowerRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IReviewRepository>(),
                addressesManagerMock.Object,
                userManagerMock.Object,
                _mapperMock.Object
            );

            // Act
            var result = await sheltersManager.UpdateShelterAsync(shelterId, updateDto);

            // Assert
            Assert.Null(result);
            _repositoryMock.Verify(r => r.Update(It.IsAny<Shelter>()), Times.Never);
        }
    }
}