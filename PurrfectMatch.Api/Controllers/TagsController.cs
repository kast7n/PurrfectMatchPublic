using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Posts;
using PurrfectMatch.Shared.DTOs.Posts;

namespace PurrfectMatch.Api.Controllers
{
    public class TagsController : BaseApiController
    {
        private readonly TagsManager _tagsManager;
        private readonly IMapper _mapper;

        public TagsController(TagsManager tagsManager, IMapper mapper)
        {
            _tagsManager = tagsManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetFilteredTags([FromQuery] TagFilterDto filter)
        {
            var tags = await _tagsManager.GetFilteredTagsAsync(filter);
            return Ok(tags);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTags()
        {
            var tags = await _tagsManager.GetAllTagsAsync();
            return Ok(tags);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var tag = await _tagsManager.GetTagByIdAsync(id);
            if (tag == null) return NotFound();
            return Ok(tag);
        }

        [HttpGet("name/{tagName}")]
        public async Task<IActionResult> GetByName(string tagName)
        {
            var tag = await _tagsManager.GetTagByNameAsync(tagName);
            if (tag == null) return NotFound();
            return Ok(tag);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTagDto createTagDto)
        {
            try
            {
                var tag = await _tagsManager.CreateTagAsync(createTagDto);
                return CreatedAtAction(nameof(GetById), new { id = tag.TagId }, tag);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTagDto updateTagDto)
        {
            try
            {
                var tag = await _tagsManager.UpdateTagAsync(id, updateTagDto);
                if (tag == null)
                {
                    return NotFound();
                }

                return Ok(tag);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _tagsManager.DeleteTagAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetTagsByPost(int postId)
        {
            var tags = await _tagsManager.GetTagsByPostAsync(postId);
            return Ok(tags);
        }
    }
}
