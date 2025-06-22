using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Moq;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Pets.HealthRecords;
using Xunit;

namespace PurrfectMatch.Tests.UseCases.Pets
{
    public class HealthRecordUseCaseTests
    {
        [Fact]
        public async Task GetHealthRecordsByPetAsync_ShouldReturnHealthRecords_WhenRecordsExist()
        {
            // Arrange
            var mockHealthRecordRepository = new Mock<IHealthRecordRepository>();
            var mockMapper = new Mock<IMapper>();
            var mockBaseRepository = new Mock<IBaseRepository<HealthRecord>>();

            var petId = 1;
            var healthRecords = new List<HealthRecord>
            {
                new HealthRecord { RecordId = 101, PetId = petId, VaccinationDetails = "Vaccination" },
                new HealthRecord { RecordId = 102, PetId = petId, MedicalHistory = "Checkup" }
            };
            var healthRecordDtos = new List<HealthRecordDto>
            {
                new HealthRecordDto { Id = 101, PetId = petId, Description = "Vaccination" },
                new HealthRecordDto { Id = 102, PetId = petId, Description = "Checkup" }
            };

            mockHealthRecordRepository.Setup(repo => repo.GetHealthRecordsByPetAsync(petId)).ReturnsAsync(healthRecords);
            mockMapper.Setup(mapper => mapper.Map<IReadOnlyList<HealthRecordDto>>(healthRecords)).Returns(healthRecordDtos);

            var healthRecordsManager = new HealthRecordsManager(
                mockBaseRepository.Object,
                mockHealthRecordRepository.Object,
                mockMapper.Object
            );

            // Act
            var result = await healthRecordsManager.GetHealthRecordsByPetAsync(petId);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.Description == "Vaccination");
            Assert.Contains(result, r => r.Description == "Checkup");
        }

        [Fact]
        public async Task GetHealthRecordsByShelterAsync_ShouldReturnHealthRecords_WhenRecordsExist()
        {
            // Arrange
            var mockHealthRecordRepository = new Mock<IHealthRecordRepository>();
            var mockMapper = new Mock<IMapper>();
            var mockBaseRepository2 = new Mock<IBaseRepository<HealthRecord>>();

            var shelterId = 1;
            var healthRecords = new List<HealthRecord>
            {
                new HealthRecord { RecordId = 201, VaccinationDetails = "Deworming" },
                new HealthRecord { RecordId = 202, MedicalHistory = "Neutering" }
            };
            var healthRecordDtos = new List<HealthRecordDto>
            {
                new HealthRecordDto { Id = 201, Description = "Deworming" },
                new HealthRecordDto { Id = 202, Description = "Neutering" }
            };

            mockHealthRecordRepository.Setup(repo => repo.GetHealthRecordsByShelterAsync(shelterId)).ReturnsAsync(healthRecords);
            mockMapper.Setup(mapper => mapper.Map<IReadOnlyList<HealthRecordDto>>(healthRecords)).Returns(healthRecordDtos);

            var healthRecordsManager2 = new HealthRecordsManager(
                mockBaseRepository2.Object,
                mockHealthRecordRepository.Object,
                mockMapper.Object
            );

            // Act
            var result2 = await healthRecordsManager2.GetHealthRecordsByShelterAsync(shelterId);

            // Assert
            Assert.Equal(2, result2.Count);
            Assert.Contains(result2, r => r.Description == "Deworming");
            Assert.Contains(result2, r => r.Description == "Neutering");
        }
    }
}