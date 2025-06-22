using Moq;
using AutoMapper;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Application.Specifications.Addresses;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Addresses;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Addresses
{
    public class GetFilteredAddressesManagerTests
    {
        private readonly Mock<IBaseRepository<Address>> _repositoryMock;
        private readonly Mock<IMapper> _mapperMock;

        public GetFilteredAddressesManagerTests()
        {
            _repositoryMock = new Mock<IBaseRepository<Address>>();
            _mapperMock = new Mock<IMapper>();
        }

        [Fact]
        public async Task GetFilteredAddressesAsync_ShouldReturnFilteredAddresses_WhenFilterIsApplied()
        {
            // Arrange
            var filter = new AddressFilterDto { City = "Sample City" };
            var addresses = new List<Address>
            {
                new Address { AddressId = 1, Street = "123 Main St", City = "Sample City", State = "SC" },
                new Address { AddressId = 2, Street = "456 Elm St", City = "Sample City", State = "SC" }
            };

            _repositoryMock.Setup(r => r.ListAsync(It.IsAny<AddressFilterSpecification>())).ReturnsAsync(addresses);

            var manager = new AddressesManager(_repositoryMock.Object, _mapperMock.Object);

            // Act
            var result = await manager.GetFilteredAddressesAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.All(result, address => Assert.Equal("Sample City", address.City));
            _repositoryMock.Verify(r => r.ListAsync(It.IsAny<AddressFilterSpecification>()), Times.Once);
        }

        [Fact]
        public async Task GetFilteredAddressesAsync_ShouldReturnEmptyList_WhenNoAddressesMatchFilter()
        {
            // Arrange
            var filter = new AddressFilterDto { City = "Nonexistent City" };

            _repositoryMock.Setup(r => r.ListAsync(It.IsAny<AddressFilterSpecification>())).ReturnsAsync(new List<Address>());

            var manager = new AddressesManager(_repositoryMock.Object, _mapperMock.Object);

            // Act
            var result = await manager.GetFilteredAddressesAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
            _repositoryMock.Verify(r => r.ListAsync(It.IsAny<AddressFilterSpecification>()), Times.Once);
        }
    }
}