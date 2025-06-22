using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Posts;
using PurrfectMatch.Shared.DTOs.Posts;
using System.Security.Claims;

namespace PurrfectMatch.Api.Controllers
{
    public class PostsController : BaseApiController
    {
        private readonly PostsManager _postsManager;
        private readonly IMapper _mapper;

        public PostsController(PostsManager postsManager, IMapper mapper)
        {
            _postsManager = postsManager;
            _mapper = mapper;
        }        [HttpGet]
        public async Task<IActionResult> GetFilteredPosts([FromQuery] PostFilterDto filter)
        {
            var result = await _postsManager.GetFilteredPostsAsync(filter);
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postsManager.GetAllPostsAsync();
            
            // Debug: Show all post types in the database
            Console.WriteLine("=== All Posts Debug Info ===");
            Console.WriteLine($"Total posts found: {posts.Count()}");
            foreach (var post in posts.Take(5)) // Show first 5 posts
            {
                Console.WriteLine($"Post ID: {post.PostId}, PostType: '{post.PostType}', Title: '{post.Title}'");
            }
            Console.WriteLine("============================");
            
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var post = await _postsManager.GetPostByIdAsync(id);
            if (post == null) return NotFound();
            return Ok(post);
        }        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreatePostDto createPostDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Check if user is admin
            if (!User.IsInRole("Admin"))
            {
                return Forbid("Only administrators can create posts with content.");
            }

            // Override the UserId from the DTO with the authenticated user's ID
            createPostDto.UserId = userId;

            try
            {
                var post = await _postsManager.CreatePostAsync(createPostDto);
                return CreatedAtAction(nameof(GetById), new { id = post.PostId }, post);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePostDto updatePostDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Check if user is admin
            if (!User.IsInRole("Admin"))
            {
                return Forbid("Only administrators can update posts.");
            }

            try
            {
                var post = await _postsManager.UpdatePostAsync(id, userId, updatePostDto);
                if (post == null)
                {
                    return NotFound();
                }

                return Ok(post);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            // Check if user is admin
            if (!User.IsInRole("Admin"))
            {
                return Forbid("Only administrators can delete posts.");
            }

            var result = await _postsManager.DeletePostAsync(id, userId);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPosts(string userId)
        {
            var posts = await _postsManager.GetPostsByUserAsync(userId);
            return Ok(posts);
        }

        [HttpGet("shelter/{shelterId}")]
        public async Task<IActionResult> GetShelterPosts(int shelterId)
        {
            var posts = await _postsManager.GetPostsByShelterAsync(shelterId);
            return Ok(posts);
        }

        [HttpGet("tag/{tagId}")]
        public async Task<IActionResult> GetPostsByTag(int tagId)
        {
            var posts = await _postsManager.GetPostsByTagAsync(tagId);
            return Ok(posts);
        }
    }
}
