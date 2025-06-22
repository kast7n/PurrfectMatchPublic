using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurrfectMatch.Domain.Interfaces.IRepositories
{    public interface IUserProfileRepository : IBaseRepository<UserProfile>
    {
        Task<UserProfile?> GetUserProfileByUserId(string userId);
    }
}
