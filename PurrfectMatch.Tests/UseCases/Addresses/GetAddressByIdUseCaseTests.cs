using Moq;
using AutoMapper;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using System.Threading.Tasks;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Addresses
{
    public class GetAddressByIdManagerTests
    {
        private readonly Mock<IBaseRepository<Address>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;

        public GetAddressByIdManagerTests()
        {
            _repositoryMock = new Mock<IBaseRepository<Address>>();
            _mapperMock = new Mock<IMapper>();
        }

        [Fact]
        public async Task GetAddressByIdAsync_ShouldReturnAddress_WhenAddressExists()
        {
            // Arrange
            var addressId = 1;
            var address = new Address { AddressId = addressId, Street = "123 Main St", City = "Sample City", State = "SC" };

            _repositoryMock.Setup(r => r.GetAsync(addressId)).ReturnsAsync(address);

            var manager = new AddressesManager(_repositoryMock.Object, _mapperMock.Object);

            // Act
            var result = await manager.GetAddressByIdAsync(addressId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(addressId, result.AddressId);
            _repositoryMock.Verify(r => r.GetAsync(addressId), Times.Once);
        }

        [Fact]
        public async Task GetAddressByIdAsync_ShouldReturnNull_WhenAddressDoesNotExist()
        {
            // Arrange
            var addressId = 1;

            _repositoryMock.Setup(r => r.GetAsync(addressId)).ReturnsAsync((Address?)null);

            var manager = new AddressesManager(_repositoryMock.Object, _mapperMock.Object);

            // Act
            var result = await manager.GetAddressByIdAsync(addressId);

            // Assert
            Assert.Null(result);
            _repositoryMock.Verify(r => r.GetAsync(addressId), Times.Once);
        }
    }
}