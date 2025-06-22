using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PurrfectMatch.Domain.Entities;

namespace PurrfectMatch.Domain.Interfaces.IRepositories.Miscellaneous.Donations;

public interface IDonationsRepository
{
    Task<IEnumerable<Donation>> GetDonationsByUserIdAsync(string userId);
    Task<Donation?> GetDonationByPaymentIntentIdAsync(string paymentIntentId);
}
