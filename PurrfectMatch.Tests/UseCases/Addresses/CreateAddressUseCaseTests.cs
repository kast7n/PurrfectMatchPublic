using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Addresses;
using System.Threading.Tasks;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Addresses
{
    public class CreateAddressManagerTests
    {
        private readonly Mock<IBaseRepository<Address>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;

        public CreateAddressManagerTests()
        {
            _repositoryMock = new Mock<IBaseRepository<Address>>();
            _mapperMock = new Mock<IMapper>();
        }

        [Fact]
        public async Task CreateAddressAsync_ShouldCreateAddressAndReturnId()
        {
            // Arrange
            var addressDto = new AddressDto { Street = "123 Main St", City = "Sample City", State = "SC" };
            var address = new Address { AddressId = 1, Street = "123 Main St", City = "Sample City", State = "SC" };

            _mapperMock.Setup(m => m.Map<Address>(addressDto)).Returns(address);
            _repositoryMock.Setup(r => r.CreateAsync(address)).Returns(Task.CompletedTask);
            _repositoryMock.Setup(r => r.SaveChangesAsync()).Returns(Task.CompletedTask);

            var manager = new AddressesManager(_repositoryMock.Object, _mapperMock.Object);

            // Act
            var result = await manager.CreateAddressAsync(addressDto);

            // Assert
            Assert.Equal(1, result);
            _repositoryMock.Verify(r => r.CreateAsync(address), Times.Once);
            _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }
    }
}