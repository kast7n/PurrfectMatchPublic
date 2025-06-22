using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;

namespace PurrfectMatch.Domain.Interfaces.IRepositories.Posts
{
    public interface ITagRepository : IBaseRepository<Tag>
    {
        Task<IEnumerable<Tag>> GetFilteredTagsAsync(
            string? tagName = null,
            DateTime? createdAfter = null,
            DateTime? createdBefore = null,
            int pageNumber = 1,
            int pageSize = 10,
            string? sortBy = null,
            bool sortDescending = false);
        Task<Tag?> GetTagByNameAsync(string tagName);
        Task<IEnumerable<Tag>> GetTagsByPostAsync(int postId);
    }
}
