using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Infrastructure.Data;
using PurrfectMatch.Infrastructure.Repositories.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurrfectMatch.Infrastructure.Repositories.User
{    public class UserProfileRepository : BaseRepository<UserProfile>, IUserProfileRepository
    {
        private readonly PurrfectMatchContext _dbContext;
        public UserProfileRepository(PurrfectMatchContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<UserProfile?> GetUserProfileByUserId(string userId)
        {
            var userProfile = await _dbContext.UserProfiles
                .FirstOrDefaultAsync(up => up.UserId == userId);
            return userProfile;        }
    }
}
