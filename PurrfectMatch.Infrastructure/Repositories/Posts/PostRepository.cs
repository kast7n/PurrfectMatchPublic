using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Posts;
using PurrfectMatch.Infrastructure.Data;
using PurrfectMatch.Infrastructure.Repositories.Base;

namespace PurrfectMatch.Infrastructure.Repositories.Posts
{
    public class PostRepository : BaseRepository<Post>, IPostRepository
    {
        public PostRepository(PurrfectMatchContext context) : base(context)
        {
        }        public async Task<IEnumerable<Post>> GetFilteredPostsAsync(
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
            bool sortDescending = false)
        {
            var query = _context.Posts
                .Include(p => p.User)
                .Include(p => p.Shelter)
                .Include(p => p.Tags)
                .AsQueryable();            if (!string.IsNullOrEmpty(postType))
                query = query.Where(p => p.PostType.ToLower().Contains(postType.ToLower()));

            if (shelterId.HasValue)
                query = query.Where(p => p.ShelterId == shelterId);

            if (!string.IsNullOrEmpty(userId))
                query = query.Where(p => p.UserId == userId);            if (!string.IsNullOrEmpty(title))
                query = query.Where(p => p.Title.ToLower().Contains(title.ToLower()));            if (!string.IsNullOrEmpty(content))
                query = query.Where(p => p.Content.ToLower().Contains(content.ToLower()));

            if (tagId.HasValue)
                query = query.Where(p => p.Tags.Any(t => t.TagId == tagId));

            if (createdAfter.HasValue)
                query = query.Where(p => p.CreatedAt >= createdAfter);

            if (createdBefore.HasValue)
                query = query.Where(p => p.CreatedAt <= createdBefore);

            // Apply sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "title":
                        query = sortDescending 
                            ? query.OrderByDescending(p => p.Title)
                            : query.OrderBy(p => p.Title);
                        break;
                    case "posttype":
                        query = sortDescending 
                            ? query.OrderByDescending(p => p.PostType)
                            : query.OrderBy(p => p.PostType);
                        break;
                    case "updatedat":
                        query = sortDescending 
                            ? query.OrderByDescending(p => p.UpdatedAt)
                            : query.OrderBy(p => p.UpdatedAt);
                        break;
                    default:
                        query = sortDescending 
                            ? query.OrderByDescending(p => p.CreatedAt)
                            : query.OrderBy(p => p.CreatedAt);
                        break;
                }
            }
            else
            {
                query = query.OrderByDescending(p => p.CreatedAt);
            }

            // Apply pagination
            query = query.Skip((pageNumber - 1) * pageSize)
                         .Take(pageSize);

            return await query.ToListAsync();
        }

        public async Task<Post?> GetPostWithTagsAsync(int postId)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Shelter)
                .Include(p => p.Tags)
                .FirstOrDefaultAsync(p => p.PostId == postId);
        }

        public async Task<IEnumerable<Post>> GetPostsByUserAsync(string userId)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Shelter)
                .Include(p => p.Tags)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPostsByShelterAsync(int shelterId)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Shelter)
                .Include(p => p.Tags)
                .Where(p => p.ShelterId == shelterId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Post>> GetPostsByTagAsync(int tagId)
        {
            return await _context.Posts
                .Include(p => p.User)
                .Include(p => p.Shelter)
                .Include(p => p.Tags)
                .Where(p => p.Tags.Any(t => t.TagId == tagId))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
    }
}
