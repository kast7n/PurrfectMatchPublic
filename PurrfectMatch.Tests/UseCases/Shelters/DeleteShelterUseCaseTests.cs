using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Application.Managers;
using Moq;
using Xunit;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace PurrfectMatch.Tests.UseCases.Shelters
{
    public class DeleteShelterUseCaseTests
    {
        private readonly Mock<IBaseRepository<Shelter>> _repositoryMock;

        public DeleteShelterUseCaseTests()
        {
            _repositoryMock = new Mock<IBaseRepository<Shelter>>();
        }

        [Fact]
        public async Task Execute_ShouldDeleteShelter_WhenShelterExists()
        {
            // Arrange
            var shelterId = 1;
            var shelter = new Shelter { ShelterId = shelterId };            _repositoryMock.Setup(r => r.GetAsync(shelterId)).ReturnsAsync(shelter);
            _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);            var addressesManagerMock = new Mock<AddressesManager>(
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
                Mock.Of<AutoMapper.IMapper>(),
                null
            );

            // Act
            await sheltersManager.DeleteShelterAsync(shelterId);

            // Assert
            _repositoryMock.Verify(r => r.GetAsync(shelterId), Times.Once);
            _repositoryMock.Verify(r => r.Delete(shelter), Times.Once);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}