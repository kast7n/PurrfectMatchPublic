using Moq;
using AutoMapper;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.AdoptionApplications;

public class DeleteAdoptionApplicationManagerTests
{
    private readonly Mock<IBaseRepository<AdoptionApplication>> _repositoryMock;
    private readonly Mock<IBaseRepository<Pet>> _petRepositoryMock;
    private readonly Mock<IBaseRepository<ShelterManager>> _shelterManagerRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly AdoptionApplicationsManager _manager;

    public DeleteAdoptionApplicationManagerTests()
    {
        _repositoryMock = new Mock<IBaseRepository<AdoptionApplication>>();
        _petRepositoryMock = new Mock<IBaseRepository<Pet>>();
        _shelterManagerRepositoryMock = new Mock<IBaseRepository<ShelterManager>>();
        _mapperMock = new Mock<IMapper>();
        _manager = new AdoptionApplicationsManager(
            _repositoryMock.Object, 
            _petRepositoryMock.Object, 
            _shelterManagerRepositoryMock.Object, 
            _mapperMock.Object);
    }

    [Fact]
    public async Task DeleteAdoptionApplicationAsync_Should_Call_Delete_Method_On_Repository()
    {
        // Arrange
        var adoptionApplication = new AdoptionApplication { ApplicationId = 1 };
        _repositoryMock.Setup(r => r.GetAsync(adoptionApplication.ApplicationId)).ReturnsAsync(adoptionApplication);

        // Act
        var result = await _manager.DeleteAdoptionApplicationAsync(adoptionApplication.ApplicationId);

        // Assert
        Assert.True(result);
        _repositoryMock.Verify(r => r.GetAsync(adoptionApplication.ApplicationId), Times.Once);
        _repositoryMock.Verify(r => r.Delete(adoptionApplication), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}