using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.CoatLength;

namespace PurrfectMatch.Api.Controllers
{
    public class CoatLengthsController(CoatLengthsManager coatLengthsManager) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CoatLengthFilterDto filter)
        {
            var coatLengths = await coatLengthsManager.GetCoatLengthsAsync(filter);
            return Ok(coatLengths);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var coatLength = await coatLengthsManager.GetCoatLengthAsync(id);
            return coatLength == null ? NotFound() : Ok(coatLength);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CoatLengthDto dto)
        {
            var created = await coatLengthsManager.CreateCoatLengthAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.CoatLengthId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CoatLengthDto dto)
        {
            var updated = await coatLengthsManager.UpdateCoatLengthAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await coatLengthsManager.DeleteCoatLengthAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}



