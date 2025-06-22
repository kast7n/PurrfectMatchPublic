using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Posts;
using PurrfectMatch.Infrastructure.Data;
using PurrfectMatch.Infrastructure.Repositories.Base;

namespace PurrfectMatch.Infrastructure.Repositories.Posts
{
    public class TagRepository : BaseRepository<Tag>, ITagRepository
    {
        public TagRepository(PurrfectMatchContext context) : base(context)
        {
        }        public async Task<IEnumerable<Tag>> GetFilteredTagsAsync(
            string? tagName = null,
            DateTime? createdAfter = null,
            DateTime? createdBefore = null,
            int pageNumber = 1,
            int pageSize = 10,
            string? sortBy = null,
            bool sortDescending = false)
        {
            var query = _context.Tags.AsQueryable();

            if (!string.IsNullOrEmpty(tagName))
                query = query.Where(t => t.TagName.Contains(tagName));

            if (createdAfter.HasValue)
                query = query.Where(t => t.CreatedAt >= createdAfter);

            if (createdBefore.HasValue)
                query = query.Where(t => t.CreatedAt <= createdBefore);

            // Apply sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "tagname":
                        query = sortDescending 
                            ? query.OrderByDescending(t => t.TagName)
                            : query.OrderBy(t => t.TagName);
                        break;
                    default:
                        query = sortDescending 
                            ? query.OrderByDescending(t => t.CreatedAt)
                            : query.OrderBy(t => t.CreatedAt);
                        break;
                }
            }
            else
            {
                query = query.OrderBy(t => t.TagName);
            }

            // Apply pagination
            query = query.Skip((pageNumber - 1) * pageSize)
                         .Take(pageSize);

            return await query.ToListAsync();
        }

        public async Task<Tag?> GetTagByNameAsync(string tagName)
        {
            return await _context.Tags
                .FirstOrDefaultAsync(t => t.TagName.ToLower() == tagName.ToLower());
        }

        public async Task<IEnumerable<Tag>> GetTagsByPostAsync(int postId)
        {
            return await _context.Tags
                .Where(t => t.Posts.Any(p => p.PostId == postId))
                .OrderBy(t => t.TagName)
                .ToListAsync();
        }
    }
}
