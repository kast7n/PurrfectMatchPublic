using Moq;
using PurrfectMatch.Application.Specifications.ShelterSpecifications;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Shelters;
using PurrfectMatch.Application.Managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using AutoMapper;

namespace PurrfectMatch.Tests.UseCases.Shelters
{
    public class GetShelterApplicationsUseCaseTests
    {
        [Fact]
        public async Task ExecuteAsync_ReturnsFilteredShelterApplications()
        {
            // Arrange
            var mockRepository = new Mock<IBaseRepository<ShelterCreationRequest>>();
            var filter = new ShelterApplicationFilterDto 
            { 
                IsApproved = true, 
                CreatedAfter = DateTime.UtcNow.AddDays(-30), 
                CreatedBefore = DateTime.UtcNow
            };

            var expectedApplications = new List<ShelterCreationRequest>
            {
                new ShelterCreationRequest { RequestId = 1, ShelterName = "Shelter A", Status = "Pending", IsApproved = true },
                new ShelterCreationRequest { RequestId = 2, ShelterName = "Shelter B", Status = "Pending", IsApproved = true }
            };            mockRepository
                .Setup(repo => repo.ListAsync(It.IsAny<ShelterApplicationFilterSpecification>()))
                .ReturnsAsync(expectedApplications);

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
                mockRepository.Object,
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
            var result = await sheltersManager.GetShelterApplicationsAsync(filter);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedApplications.Count, result.Count);
            Assert.True(result.SequenceEqual(expectedApplications));
        }
    }
}