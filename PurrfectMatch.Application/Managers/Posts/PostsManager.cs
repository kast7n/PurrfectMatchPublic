using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PurrfectMatch.Application.Specifications.Posts;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.IRepositories.Posts;
using PurrfectMatch.Shared.DTOs.Posts;

namespace PurrfectMatch.Application.Managers.Posts
{
    public class PostsManager
    {
        private readonly IPostRepository _postRepository;
        private readonly ITagRepository _tagRepository;
        private readonly IBaseRepository<Shelter> _shelterRepository;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public PostsManager(
            IPostRepository postRepository,
            ITagRepository tagRepository,
            IBaseRepository<Shelter> shelterRepository,
            UserManager<User> userManager,
            IMapper mapper)
        {
            _postRepository = postRepository;
            _tagRepository = tagRepository;
            _shelterRepository = shelterRepository;
            _userManager = userManager;
            _mapper = mapper;
        }        public async Task<PaginatedPostsResponseDto> GetFilteredPostsAsync(PostFilterDto filter)
        {
            var spec = new PostsFilterSpecification(filter);
            
            // Get the posts for the current page
            var posts = await _postRepository.ListAsync(spec);
            
            // Get the total count using the same filter but without pagination
            // Create a copy of the filter with pagination disabled for counting
            var countFilter = new PostFilterDto
            {
                PostType = filter.PostType,
                ShelterId = filter.ShelterId,
                UserId = filter.UserId,
                Title = filter.Title,
                Content = filter.Content,
                TagId = filter.TagId,
                CreatedAfter = filter.CreatedAfter,
                CreatedBefore = filter.CreatedBefore,
                SortBy = filter.SortBy,
                SortDescending = filter.SortDescending,
                PageNumber = 1,
                PageSize = int.MaxValue // This will effectively disable pagination for counting
            };
            var countSpec = new PostsFilterSpecification(countFilter);
            var totalCount = await _postRepository.CountAsync(countSpec);
            
            // Map posts to DTOs
            var postDtos = new List<PostDto>();

            foreach (var post in posts)
            {
                var postDto = await MapToPostDtoAsync(post);
                postDtos.Add(postDto);
            }

            var totalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize);

            return new PaginatedPostsResponseDto
            {
                Items = postDtos,
                TotalCount = totalCount,
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalPages = totalPages
            };
        }

        public async Task<PostDto?> GetPostByIdAsync(int postId)
        {
            var post = await _postRepository.GetPostWithTagsAsync(postId);
            if (post == null) return null;

            return await MapToPostDtoAsync(post);
        }

        public async Task<IEnumerable<PostDto>> GetAllPostsAsync()
        {
            var posts = await _postRepository.ListAllAsync();
            var postDtos = new List<PostDto>();

            foreach (var post in posts)
            {
                var postDto = await MapToPostDtoAsync(post);
                postDtos.Add(postDto);
            }

            return postDtos;
        }

        public async Task<PostDto> CreatePostAsync(CreatePostDto createPostDto)
        {
            var post = _mapper.Map<Post>(createPostDto);
            post.CreatedAt = DateTime.UtcNow;
            post.UpdatedAt = DateTime.UtcNow;

            // Handle tags
            if (createPostDto.TagIds != null && createPostDto.TagIds.Any())
            {
                var tags = new List<Tag>();
                foreach (var tagId in createPostDto.TagIds)
                {
                    var tag = await _tagRepository.GetAsync(tagId);
                    if (tag != null)
                    {
                        tags.Add(tag);
                    }
                }
                post.Tags = tags;
            }

            await _postRepository.CreateAsync(post);
            await _postRepository.SaveChangesAsync();

            return await MapToPostDtoAsync(post);
        }        public async Task<PostDto?> UpdatePostAsync(int postId, string userId, UpdatePostDto updatePostDto)
        {
            var post = await _postRepository.GetPostWithTagsAsync(postId);
            if (post == null)
            {
                return null;
            }

            // Update basic properties
            if (!string.IsNullOrEmpty(updatePostDto.PostType))
                post.PostType = updatePostDto.PostType;

            if (!string.IsNullOrEmpty(updatePostDto.Title))
                post.Title = updatePostDto.Title;

            if (!string.IsNullOrEmpty(updatePostDto.Content))
                post.Content = updatePostDto.Content;

            post.UpdatedAt = DateTime.UtcNow;

            // Handle tags update
            if (updatePostDto.TagIds != null)
            {
                // Clear existing tags
                post.Tags.Clear();

                // Add new tags
                var tags = new List<Tag>();
                foreach (var tagId in updatePostDto.TagIds)
                {
                    var tag = await _tagRepository.GetAsync(tagId);
                    if (tag != null)
                    {
                        tags.Add(tag);
                    }
                }
                post.Tags = tags;
            }

            _postRepository.Update(post);
            await _postRepository.SaveChangesAsync();

            return await MapToPostDtoAsync(post);
        }        public async Task<bool> DeletePostAsync(int postId, string userId)
        {
            // Get the post with its tags to ensure proper cascade delete
            var post = await _postRepository.GetPostWithTagsAsync(postId);
            if (post == null)
            {
                return false;
            }

            // Clear the tags collection to remove relationships
            post.Tags.Clear();
            
            _postRepository.Delete(post);
            await _postRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PostDto>> GetPostsByUserAsync(string userId)
        {
            var posts = await _postRepository.GetPostsByUserAsync(userId);
            var postDtos = new List<PostDto>();

            foreach (var post in posts)
            {
                var postDto = await MapToPostDtoAsync(post);
                postDtos.Add(postDto);
            }

            return postDtos;
        }

        public async Task<IEnumerable<PostDto>> GetPostsByShelterAsync(int shelterId)
        {
            var posts = await _postRepository.GetPostsByShelterAsync(shelterId);
            var postDtos = new List<PostDto>();

            foreach (var post in posts)
            {
                var postDto = await MapToPostDtoAsync(post);
                postDtos.Add(postDto);
            }

            return postDtos;
        }

        public async Task<IEnumerable<PostDto>> GetPostsByTagAsync(int tagId)
        {
            var posts = await _postRepository.GetPostsByTagAsync(tagId);
            var postDtos = new List<PostDto>();

            foreach (var post in posts)
            {
                var postDto = await MapToPostDtoAsync(post);
                postDtos.Add(postDto);
            }

            return postDtos;
        }

        private async Task<PostDto> MapToPostDtoAsync(Post post)
        {
            var user = await _userManager.FindByIdAsync(post.UserId);
            
            return new PostDto
            {
                PostId = post.PostId,
                PostType = post.PostType,
                ShelterId = post.ShelterId,
                ShelterName = post.Shelter?.Name ?? string.Empty,
                UserId = post.UserId,
                UserName = user?.UserName ?? "Unknown User",
                Title = post.Title,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                Tags = post.Tags.Select(t => _mapper.Map<TagDto>(t)).ToList()            };
        }
    }
}
