using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Miscellaneous.Donations;
using PurrfectMatch.Infrastructure.Data;
using PurrfectMatch.Infrastructure.Repositories.Base;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PurrfectMatch.Infrastructure.Repositories.Miscellaneous.Donations
{
    public class DonationsRepository : BaseRepository<Donation>, IDonationsRepository
    {
        private readonly PurrfectMatchContext _dbContext;

        public DonationsRepository(PurrfectMatchContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }        public async Task<IEnumerable<Donation>> GetDonationsByUserIdAsync(string userId)
        {
            return await _dbContext.Donations
                                   .Where(d => d.UserId == userId)
                                   .AsNoTracking() // Don't track navigation properties
                                   .ToListAsync();
        }        public async Task<Donation?> GetDonationByPaymentIntentIdAsync(string paymentIntentId)
        {
            return await _dbContext.Donations
                                   .Where(d => d.StripePaymentIntentId == paymentIntentId)
                                   .AsNoTracking()
                                   .FirstOrDefaultAsync();
        }
    }
}
