using PurrfectMatch.Domain.Interfaces.Specifications;


namespace PurrfectMatch.Domain.Interfaces.IRepositories.Base
{
    public interface IBaseRepository<T> where T : class
    {
        Task<T?> GetAsync(int id);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec);
        Task<int> CountAsync(ISpecification<T> spec);
        Task CreateAsync(T entity);
        Task CreateRangeAsync(IEnumerable<T> entities);
        void Update(T entity);
        void Delete(T entity); // Hard Delete
        Task SaveChangesAsync();
        
    }
}
