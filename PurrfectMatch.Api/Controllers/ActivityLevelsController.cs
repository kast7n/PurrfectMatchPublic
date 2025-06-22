using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.ActivityLevels;

namespace PurrfectMatch.Api.Controllers
{
    public class ActivityLevelsController(ActivityLevelsManager activityLevelsManager) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ActivityLevelFilterDto filter)
        {
            var activityLevels = await activityLevelsManager.GetActivityLevelsAsync(filter);
            return Ok(activityLevels);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var activityLevel = await activityLevelsManager.GetActivityLevelAsync(id);
            return activityLevel == null ? NotFound() : Ok(activityLevel);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ActivityLevelDto dto)
        {
            var created = await activityLevelsManager.CreateActivityLevelAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.ActivityLevelId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ActivityLevelDto dto)
        {
            var updated = await activityLevelsManager.UpdateActivityLevelAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await activityLevelsManager.DeleteActivityLevelAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}



