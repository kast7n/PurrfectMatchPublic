using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PurrfectMatch.Application.Services
{
    public class FollowerService
    {
        private readonly IFollowerRepository _followerRepository;

        public FollowerService(IFollowerRepository followerRepository)
        {
            _followerRepository = followerRepository;
        }

        public async Task<IReadOnlyList<ShelterFollower>> GetShelterFollowersAsync(int shelterId)
        {
            return await _followerRepository.GetShelterFollowersAsync(shelterId);
        }

        public async Task<IReadOnlyList<ShelterFollower>> GetFollowedSheltersAsync(string userId)
        {
            return await _followerRepository.GetFollowedSheltersAsync(userId);
        }
    }
}