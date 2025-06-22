using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Colors;

namespace PurrfectMatch.Api.Controllers
{
    public class ColorsController(ColorsManager colorsManager) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ColorFilterDto filter)
        {
            var colors = await colorsManager.GetColorsAsync(filter);
            return Ok(colors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var color = await colorsManager.GetColorAsync(id);
            return color == null ? NotFound() : Ok(color);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ColorDto dto)
        {
            var created = await colorsManager.CreateColorAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.ColorId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ColorDto dto)
        {
            var updated = await colorsManager.UpdateColorAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await colorsManager.DeleteColorAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}



