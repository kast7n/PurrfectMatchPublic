using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PurrfectMatch.Domain.Interfaces.IRepositories
{
    public interface IReviewRepository : IBaseRepository<Review>
    {
        Task<IReadOnlyList<Review>> GetShelterReviewsAsync(int shelterId);
        Task<IReadOnlyList<Review>> GetUserReviewsAsync(string userId);
    }
}