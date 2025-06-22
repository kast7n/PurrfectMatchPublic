using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Specifications.ShelterSpecifications;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Shelters;
using PurrfectMatch.Application.Managers;
using Xunit;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace PurrfectMatch.Tests.UseCases
{
    public class GetFilteredSheltersUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ReturnsFilteredShelters()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<Shelter>>();
            var filter = new ShelterFilterDto
            {
                Name = "Happy",
                City = "New York",
                State = "NY",
                PageNumber = 1,
                PageSize = 10,
                SortBy = "Name",
                SortDescending = false
            };

            var expectedShelters = new List<Shelter>
            {
                new Shelter
                {
                    ShelterId = 1,
                    Name = "Happy Tails Shelter",
                    Address = new Address { City = "New York", State = "NY" },
                    PhoneNumber = "123-456-7890",
                    Email = "contact@happytails.com",
                    Website = "https://happytails.com",
                    DonationUrl = "https://happytails.com/donate",
                    Description = "A shelter for happy tails.",
                    IsDeleted = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    UpdatedAt = DateTime.UtcNow.AddDays(-1),
                    Pets = new List<Pet>(),
                    ShelterManagers = new List<ShelterManager>()
                },
                new Shelter
                {
                    ShelterId = 2,
                    Name = "Paws and Claws",
                    Address = new Address { City = "New York", State = "NY" },
                    PhoneNumber = "987-654-3210",
                    Email = "info@pawsandclaws.com",
                    Website = "https://pawsandclaws.com",
                    DonationUrl = "https://pawsandclaws.com/donate",
                    Description = "A shelter for paws and claws.",
                    IsDeleted = false,
                    CreatedAt = DateTime.UtcNow.AddDays(-60),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2),
                    Pets = new List<Pet>(),
                    ShelterManagers = new List<ShelterManager>()
                }
            };            mockRepository
                .Setup(repo => repo.ListAsync(It.IsAny<ShelterFilterSpecification>()))
                .ReturnsAsync(expectedShelters);

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
                mockRepository.Object,
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
            var result = await sheltersManager.GetFilteredSheltersAsync(filter);

            // Assert
            Assert.Equal(expectedShelters, result);
        }
    }
}