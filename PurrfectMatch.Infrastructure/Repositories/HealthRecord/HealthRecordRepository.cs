using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Infrastructure.Data;
using PurrfectMatch.Infrastructure.Repositories.Base;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PurrfectMatch.Infrastructure.Repositories
{
    public class HealthRecordRepository : BaseRepository<HealthRecord>, IHealthRecordRepository
    {
        private readonly PurrfectMatchContext _dbContext;

        public HealthRecordRepository(PurrfectMatchContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<HealthRecord>> GetHealthRecordsByPetAsync(int petId)
        {
            return await _dbContext.HealthRecords
                                 .Where(hr => hr.PetId == petId)
                                 
                                 
                                 .ToListAsync();
        }
        public async Task<IReadOnlyList<HealthRecord>> GetHealthRecordsByShelterAsync(int shelterId)
        {
            return await _dbContext.HealthRecords
                                 
                                 .Where(hr => hr.Pet.ShelterId == shelterId)
                                 
                                 .ToListAsync();
        }



    }
}