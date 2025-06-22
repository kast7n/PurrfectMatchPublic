using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Posts;
using PurrfectMatch.Shared.DTOs.Posts;

namespace PurrfectMatch.Application.Managers.Posts
{
    public class TagsManager
    {
        private readonly ITagRepository _tagRepository;
        private readonly IMapper _mapper;

        public TagsManager(ITagRepository tagRepository, IMapper mapper)
        {
            _tagRepository = tagRepository;
            _mapper = mapper;
        }        public async Task<IEnumerable<TagDto>> GetFilteredTagsAsync(TagFilterDto filter)
        {
            var tags = await _tagRepository.GetFilteredTagsAsync(
                filter.TagName,
                filter.CreatedAfter,
                filter.CreatedBefore,
                filter.PageNumber,
                filter.PageSize,
                filter.SortBy,
                filter.SortDescending);

            return tags.Select(t => _mapper.Map<TagDto>(t));
        }

        public async Task<TagDto?> GetTagByIdAsync(int tagId)
        {
            var tag = await _tagRepository.GetAsync(tagId);
            return tag != null ? _mapper.Map<TagDto>(tag) : null;
        }

        public async Task<TagDto?> GetTagByNameAsync(string tagName)
        {
            var tag = await _tagRepository.GetTagByNameAsync(tagName);
            return tag != null ? _mapper.Map<TagDto>(tag) : null;
        }

        public async Task<TagDto> CreateTagAsync(CreateTagDto createTagDto)
        {
            // Check if tag already exists
            var existingTag = await _tagRepository.GetTagByNameAsync(createTagDto.TagName);
            if (existingTag != null)
            {
                throw new InvalidOperationException($"Tag with name '{createTagDto.TagName}' already exists");
            }

            var tag = _mapper.Map<Tag>(createTagDto);
            tag.CreatedAt = DateTime.UtcNow;

            await _tagRepository.CreateAsync(tag);
            await _tagRepository.SaveChangesAsync();

            return _mapper.Map<TagDto>(tag);
        }

        public async Task<TagDto?> UpdateTagAsync(int tagId, UpdateTagDto updateTagDto)
        {
            var tag = await _tagRepository.GetAsync(tagId);
            if (tag == null) return null;

            if (!string.IsNullOrEmpty(updateTagDto.TagName))
            {
                // Check if another tag with the same name already exists
                var existingTag = await _tagRepository.GetTagByNameAsync(updateTagDto.TagName);
                if (existingTag != null && existingTag.TagId != tagId)
                {
                    throw new InvalidOperationException($"Tag with name '{updateTagDto.TagName}' already exists");
                }

                tag.TagName = updateTagDto.TagName;
            }

            _tagRepository.Update(tag);
            await _tagRepository.SaveChangesAsync();

            return _mapper.Map<TagDto>(tag);
        }

        public async Task<bool> DeleteTagAsync(int tagId)
        {
            var tag = await _tagRepository.GetAsync(tagId);
            if (tag == null) return false;

            _tagRepository.Delete(tag);
            await _tagRepository.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TagDto>> GetTagsByPostAsync(int postId)
        {
            var tags = await _tagRepository.GetTagsByPostAsync(postId);
            return tags.Select(t => _mapper.Map<TagDto>(t));
        }        public async Task<IEnumerable<TagDto>> GetAllTagsAsync()
        {
            var tags = await _tagRepository.GetFilteredTagsAsync(pageSize: int.MaxValue);
            return tags.Select(t => _mapper.Map<TagDto>(t)).OrderBy(t => t.TagName);
        }
    }
}
