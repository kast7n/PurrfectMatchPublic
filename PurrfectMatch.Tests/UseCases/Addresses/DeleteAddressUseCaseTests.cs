using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using System.Threading.Tasks;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Addresses
{
    public class DeleteAddressManagerTests
    {
        private readonly Mock<IBaseRepository<Address>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;

        public DeleteAddressManagerTests()
        {
            _repositoryMock = new Mock<IBaseRepository<Address>>();
            _mapperMock = new Mock<IMapper>();
        }

        [Fact]
        public async Task DeleteAddressAsync_ShouldDeleteAddress()
        {
            // Arrange
            var addressId = 1;
            var address = new Address { AddressId = addressId };

            _repositoryMock.Setup(r => r.GetAsync(addressId)).ReturnsAsync(address);
            _repositoryMock.Setup(r => r.Delete(address)).Verifiable();
            _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var manager = new AddressesManager(_repositoryMock.Object, _mapperMock.Object);

            // Act
            var result = await manager.DeleteAddressAsync(addressId);

            // Assert
            Assert.True(result);
            _repositoryMock.Verify(r => r.GetAsync(addressId), Times.Once);
            _repositoryMock.Verify(r => r.Delete(address), Times.Once);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}