using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Shelters;
using AutoMapper;
using Moq;
using Xunit;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace PurrfectMatch.Tests.UseCases.Shelters
{
    public class CreateShelterUseCaseTests
    {
        private readonly Mock<IBaseRepository<Shelter>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IBaseRepository<Address>> _addressRepositoryMock;
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly AddressesManager _addressesManager;

        public CreateShelterUseCaseTests()
        {
            _repositoryMock = new Mock<IBaseRepository<Shelter>>();
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
        public async Task Execute_ShouldCreateShelterAndReturnId()
        {
            // Arrange
            var shelterDto = new CreateShelterDto { Name = "New Shelter" };
            var shelter = new Shelter { ShelterId = 1, Name = "New Shelter" };

            _mapperMock.Setup(m => m.Map<Shelter>(shelterDto)).Returns(shelter);
            _repositoryMock.Setup(r => r.CreateAsync(shelter)).Returns(Task.CompletedTask);
            _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);            
            
            var sheltersManager = new SheltersManager(
                _repositoryMock.Object,
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
            var result = await sheltersManager.CreateShelterAsync(shelterDto);

            // Assert
            Assert.Equal(1, result);
            _repositoryMock.Verify(r => r.CreateAsync(shelter), Times.Once);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}