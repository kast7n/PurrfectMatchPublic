using System;
using System.Threading.Tasks;
using Moq;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using Xunit;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using AutoMapper;

namespace PurrfectMatch.Tests.UseCases.Shelters
{    public class UpdateShelterApplicationStatusUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ShouldReturnFalse_WhenApplicationNotFound()
        {
            // Arrange
            var repositoryMock = new Mock<IBaseRepository<ShelterCreationRequest>>();
            repositoryMock.Setup(r => r.GetAsync(It.IsAny<int>())).ReturnsAsync((ShelterCreationRequest?)null);

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
                Mock.Of<IBaseRepository<Shelter>>(),
                repositoryMock.Object,
                Mock.Of<IBaseRepository<ShelterManager>>(),
                Mock.Of<IBaseSoftDeleteRepository<Shelter>>(),
                Mock.Of<IBaseRepository<Pet>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IFollowerRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IReviewRepository>(),
                addressesManagerMock.Object,
                userManagerMock.Object,
                Mock.Of<AutoMapper.IMapper>(),
                null
            );

            // Act
            var result = await sheltersManager.UpdateShelterApplicationStatusAsync(1, true);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task ExecuteAsync_ShouldUpdateApplicationStatus_WhenApplicationExists()
        {
            // Arrange
            var application = new ShelterCreationRequest { RequestId = 1, IsApproved = false, UpdatedAt = DateTime.UtcNow };
            var repositoryMock = new Mock<IBaseRepository<ShelterCreationRequest>>();
            repositoryMock.Setup(r => r.GetAsync(It.IsAny<int>())).ReturnsAsync(application);
            repositoryMock.Setup(r => r.Update(It.IsAny<ShelterCreationRequest>()));            repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

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
                Mock.Of<IBaseRepository<Shelter>>(),
                repositoryMock.Object,
                Mock.Of<IBaseRepository<ShelterManager>>(),
                Mock.Of<IBaseSoftDeleteRepository<Shelter>>(),
                Mock.Of<IBaseRepository<Pet>>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IFollowerRepository>(),
                Mock.Of<PurrfectMatch.Domain.Interfaces.IRepositories.IReviewRepository>(),
                addressesManagerMock.Object,
                userManagerMock.Object,
                Mock.Of<AutoMapper.IMapper>(),
                null
            );

            // Act
            var result = await sheltersManager.UpdateShelterApplicationStatusAsync(1, true);

            // Assert
            Assert.True(result);
            Assert.True(application.IsApproved);
            repositoryMock.Verify(r => r.Update(application), Times.Once);
            repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}