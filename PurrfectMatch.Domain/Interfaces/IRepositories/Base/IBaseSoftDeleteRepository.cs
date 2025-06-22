using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurrfectMatch.Domain.Interfaces.IRepositories.Base
{
    public interface IBaseSoftDeleteRepository<T> : IBaseRepository<T> where T : class
    {
        Task SoftDeleteAsync(int id);
        Task RestoreAsync(int id); // Restores back from the soft delete

    }
}
