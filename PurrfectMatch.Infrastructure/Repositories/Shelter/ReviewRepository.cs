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
    public class ReviewRepository : BaseRepository<Review>, IReviewRepository
    {
        private readonly PurrfectMatchContext _dbContext;

        public ReviewRepository(PurrfectMatchContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReadOnlyList<Review>> GetShelterReviewsAsync(int shelterId)
        {
            return await _dbContext.Reviews
                                 .Where(r => r.ShelterId == shelterId)
                                 .ToListAsync();
        }

        public async Task<IReadOnlyList<Review>> GetUserReviewsAsync(string userId)
        {
            return await _dbContext.Reviews
                                 .Where(r => r.UserId == userId)
                                 .ToListAsync();
        }
    }
}