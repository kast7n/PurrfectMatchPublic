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
    public class FollowerRepository : BaseRepository<ShelterFollower>, IFollowerRepository
    {
        private readonly PurrfectMatchContext _dbContext;

        public FollowerRepository(PurrfectMatchContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<ShelterFollower>> GetShelterFollowersAsync(int shelterId)
        {
            return await _dbContext.ShelterFollowers
                                 .Where(sf => sf.ShelterId == shelterId)
                                 .ToListAsync();
        }

        public async Task<IReadOnlyList<ShelterFollower>> GetFollowedSheltersAsync(string userId)
        {
            return await _dbContext.ShelterFollowers
                                 .Where(sf => sf.UserId == userId)
                                 .ToListAsync();
        }
    }
}