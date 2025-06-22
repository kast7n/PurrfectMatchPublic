using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;

namespace PurrfectMatch.Domain.Interfaces.IRepositories.Posts
{
    public interface IPostRepository : IBaseRepository<Post>
    {
        Task<IEnumerable<Post>> GetFilteredPostsAsync(
            string? postType = null,
            int? shelterId = null,
            string? userId = null,
            string? title = null,
            string? content = null,
            int? tagId = null,
            DateTime? createdAfter = null,
            DateTime? createdBefore = null,
            int pageNumber = 1,
            int pageSize = 10,
            string? sortBy = null,
            bool sortDescending = false);
        Task<Post?> GetPostWithTagsAsync(int postId);
        Task<IEnumerable<Post>> GetPostsByUserAsync(string userId);
        Task<IEnumerable<Post>> GetPostsByShelterAsync(int shelterId);
        Task<IEnumerable<Post>> GetPostsByTagAsync(int tagId);
    }
}
