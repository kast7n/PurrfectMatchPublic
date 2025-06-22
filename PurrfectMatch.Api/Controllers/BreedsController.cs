using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds;

namespace PurrfectMatch.Api.Controllers
{
    public class BreedsController(BreedsManager breedsManager) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] BreedFilterDto filter)
        {
            var breeds = await breedsManager.GetBreedsAsync(filter);
            return Ok(breeds);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var breed = await breedsManager.GetBreedAsync(id);
            return breed == null ? NotFound() : Ok(breed);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BreedDto dto)
        {
            var created = await breedsManager.CreateBreedAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.BreedId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] BreedDto dto)
        {
            var updated = await breedsManager.UpdateBreedAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await breedsManager.DeleteBreedAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}


