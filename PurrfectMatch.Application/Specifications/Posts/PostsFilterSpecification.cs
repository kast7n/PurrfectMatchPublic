using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using PurrfectMatch.Shared.DTOs.Posts;
using PurrfectMatch.Shared.Extensions;

namespace PurrfectMatch.Application.Specifications.Posts
{
    public class PostsFilterSpecification : BaseSpecification<Post>
    {
        public PostsFilterSpecification(PostFilterDto filter)
            : base(post => true) // Start with a base criteria that's always true
        {
            // Apply filters only if the corresponding properties are not null
            if (!string.IsNullOrEmpty(filter.PostType))
                Criteria = Criteria.And(post => post.PostType.ToLower().Contains(filter.PostType.ToLower()));

            if (filter.ShelterId.HasValue)
                Criteria = Criteria.And(post => post.ShelterId == filter.ShelterId);

            if (!string.IsNullOrEmpty(filter.UserId))
                Criteria = Criteria.And(post => post.UserId == filter.UserId);

            if (!string.IsNullOrEmpty(filter.Title))
                Criteria = Criteria.And(post => post.Title.ToLower().Contains(filter.Title.ToLower()));

            if (!string.IsNullOrEmpty(filter.Content))
                Criteria = Criteria.And(post => post.Content.ToLower().Contains(filter.Content.ToLower()));

            if (filter.TagId.HasValue)
                Criteria = Criteria.And(post => post.Tags.Any(tag => tag.TagId == filter.TagId));

            if (filter.CreatedAfter.HasValue)
                Criteria = Criteria.And(post => post.CreatedAt >= filter.CreatedAfter);

            if (filter.CreatedBefore.HasValue)
                Criteria = Criteria.And(post => post.CreatedAt <= filter.CreatedBefore);

            // Include related entities
            AddInclude(post => post.User);
            AddInclude(post => post.Shelter!);
            AddInclude(post => post.Tags);

            // Apply pagination
            ApplyPaging(filter.PageNumber, filter.PageSize);

            // Apply sorting
            ApplySorting(filter.SortBy!, filter.SortDescending);
        }

        private void ApplySorting(string sortBy, bool sortDescending)
        {
            if (string.IsNullOrEmpty(sortBy)) return;

            switch (sortBy.ToLower())
            {
                case "posttype":
                    if (sortDescending) ApplyOrderByDescending(post => post.PostType);
                    else ApplyOrderBy(post => post.PostType);
                    break;
                case "title":
                    if (sortDescending) ApplyOrderByDescending(post => post.Title);
                    else ApplyOrderBy(post => post.Title);
                    break;
                case "createdat":
                    if (sortDescending) ApplyOrderByDescending(post => post.CreatedAt);
                    else ApplyOrderBy(post => post.CreatedAt);
                    break;
                case "updatedat":
                    if (sortDescending) ApplyOrderByDescending(post => post.UpdatedAt);
                    else ApplyOrderBy(post => post.UpdatedAt);
                    break;
                case "username":
                    if (sortDescending) ApplyOrderByDescending(post => post.User != null ? post.User.UserName ?? string.Empty : string.Empty);
                    else ApplyOrderBy(post => post.User != null ? post.User.UserName ?? string.Empty : string.Empty);
                    break;
                case "sheltername":
                    if (sortDescending) ApplyOrderByDescending(post => post.Shelter != null ? post.Shelter.Name ?? string.Empty : string.Empty);
                    else ApplyOrderBy(post => post.Shelter != null ? post.Shelter.Name ?? string.Empty : string.Empty);
                    break;
                default:
                    // Default sorting by CreatedAt descending
                    ApplyOrderByDescending(post => post.CreatedAt);
                    break;
            }
        }
    }
}
