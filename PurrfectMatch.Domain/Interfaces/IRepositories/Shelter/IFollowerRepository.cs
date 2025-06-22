using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PurrfectMatch.Domain.Interfaces.IRepositories
{
    public interface IFollowerRepository : IBaseRepository<ShelterFollower>
    {
        Task<IReadOnlyList<ShelterFollower>> GetShelterFollowersAsync(int shelterId);
        Task<IReadOnlyList<ShelterFollower>> GetFollowedSheltersAsync(string userId);
    }
}