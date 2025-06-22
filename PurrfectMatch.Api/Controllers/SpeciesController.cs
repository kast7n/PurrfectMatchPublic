using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Species;

namespace PurrfectMatch.Api.Controllers
{
    public class SpeciesController(
        SpeciesManager speciesManager) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] SpeciesFilterDto filter)
        {
            var species = await speciesManager.GetSpeciesAsync(filter);
            return Ok(species);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var species = await speciesManager.GetSpeciesAsync(id);
            return species == null ? NotFound() : Ok(species);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SpeciesDto dto)
        {
            var created = await speciesManager.CreateSpeciesAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.SpeciesId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SpeciesDto dto)
        {
            var updated = await speciesManager.UpdateSpeciesAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await speciesManager.DeleteSpeciesAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}



