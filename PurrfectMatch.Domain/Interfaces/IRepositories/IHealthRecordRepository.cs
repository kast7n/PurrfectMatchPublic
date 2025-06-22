using System.Collections.Generic;
using System.Threading.Tasks;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Domain.Interfaces.IRepositories
{
    public interface IHealthRecordRepository
    {
        Task<IReadOnlyList<HealthRecord>> GetHealthRecordsByPetAsync(int petId);
        Task<IReadOnlyList<HealthRecord>> GetHealthRecordsByShelterAsync(int shelterId); // Added method
    }
}