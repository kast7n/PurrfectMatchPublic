using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.HealthStatuses;

namespace PurrfectMatch.Api.Controllers
{
    public class HealthStatusesController(
        HealthStatusesManager healthStatusesManager) : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] HealthStatusFilterDto filter)
        {
            var healthStatuses = await healthStatusesManager.GetHealthStatusesAsync(filter);
            return Ok(healthStatuses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var healthStatus = await healthStatusesManager.GetHealthStatusAsync(id);
            return healthStatus == null ? NotFound() : Ok(healthStatus);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HealthStatusDto dto)
        {
            var created = await healthStatusesManager.CreateHealthStatusAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.HealthStatusId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] HealthStatusDto dto)
        {
            var updated = await healthStatusesManager.UpdateHealthStatusAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await healthStatusesManager.DeleteHealthStatusAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}



