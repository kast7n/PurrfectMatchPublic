using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PurrfectMatch.Infrastructure.Repositories.Base
{
    public class BaseSoftDeleteRepository<T>(PurrfectMatchContext context) : BaseRepository<T>(context), IBaseSoftDeleteRepository<T> where T : class
    {
        public async Task RestoreAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return;

            var property = typeof(T).GetProperty("IsDeleted");
            if (property != null && property.PropertyType == typeof(bool))
            {
                property.SetValue(entity, false);
                Update(entity);
                await SaveChangesAsync();
            }
        }

        public async Task SoftDeleteAsync(int id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null) return;

            var property = typeof(T).GetProperty("IsDeleted");
            if (property != null && property.PropertyType == typeof(bool))
            {
                property.SetValue(entity, true);
                Update(entity);
                await SaveChangesAsync();
            }
        }
    }
}
