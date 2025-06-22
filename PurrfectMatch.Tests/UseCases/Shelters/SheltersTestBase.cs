using System;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Moq;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;

namespace PurrfectMatch.Tests.UseCases.Shelters
{
    public abstract class SheltersTestBase
    {
        protected Mock<IBaseRepository<Shelter>> ShelterRepositoryMock { get; }
        protected Mock<IBaseRepository<ShelterCreationRequest>> ShelterCreationRequestRepositoryMock { get; }
        protected Mock<IBaseRepository<ShelterManager>> ShelterManagerRepositoryMock { get; }
        protected Mock<IBaseSoftDeleteRepository<Shelter>> ShelterSoftDeleteRepositoryMock { get; }
        protected Mock<IBaseRepository<Pet>> PetRepositoryMock { get; }
        protected Mock<PurrfectMatch.Domain.Interfaces.IRepositories.IFollowerRepository> FollowerRepositoryMock { get; }
        protected Mock<PurrfectMatch.Domain.Interfaces.IRepositories.IReviewRepository> ReviewRepositoryMock { get; }
        protected Mock<IBaseRepository<Address>> AddressRepositoryMock { get; }
        protected Mock<IMapper> MapperMock { get; }
        protected Mock<UserManager<User>> UserManagerMock { get; }
        protected AddressesManager AddressesManager { get; }

        protected SheltersTestBase()
        {
            ShelterRepositoryMock = new Mock<IBaseRepository<Shelter>>();
            ShelterCreationRequestRepositoryMock = new Mock<IBaseRepository<ShelterCreationRequest>>();
            ShelterManagerRepositoryMock = new Mock<IBaseRepository<ShelterManager>>();
            ShelterSoftDeleteRepositoryMock = new Mock<IBaseSoftDeleteRepository<Shelter>>();
            PetRepositoryMock = new Mock<IBaseRepository<Pet>>();
            FollowerRepositoryMock = new Mock<PurrfectMatch.Domain.Interfaces.IRepositories.IFollowerRepository>();
            ReviewRepositoryMock = new Mock<PurrfectMatch.Domain.Interfaces.IRepositories.IReviewRepository>();
            AddressRepositoryMock = new Mock<IBaseRepository<Address>>();
            MapperMock = new Mock<IMapper>();
            
            // Create UserManager mock with proper dependencies
            UserManagerMock = new Mock<UserManager<User>>(
                Mock.Of<IUserStore<User>>(),
                null!, null!, null!, null!, null!, null!, null!, null!);
            
            // Create AddressesManager with proper dependencies
            AddressesManager = new AddressesManager(AddressRepositoryMock.Object, MapperMock.Object);
        }

        protected SheltersManager CreateSheltersManager()
        {
            return new SheltersManager(
                ShelterRepositoryMock.Object,
                ShelterCreationRequestRepositoryMock.Object,
                ShelterManagerRepositoryMock.Object,
                ShelterSoftDeleteRepositoryMock.Object,
                PetRepositoryMock.Object,
                FollowerRepositoryMock.Object,
                ReviewRepositoryMock.Object,
                AddressesManager,
                UserManagerMock.Object,
                MapperMock.Object
            );
        }
    }
}
