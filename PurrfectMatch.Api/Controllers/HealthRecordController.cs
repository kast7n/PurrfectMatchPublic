using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Shared.DTOs.Pets.HealthRecords;

namespace PurrfectMatch.Api.Controllers
{
    public class HealthRecordController(
        HealthRecordsManager healthRecordsManager) : BaseApiController
    {
        [HttpGet("pet/{petId}")]
        public async Task<IActionResult> GetByPet(int petId)
        {
            var healthRecords = await healthRecordsManager.GetHealthRecordsByPetAsync(petId);
            return Ok(healthRecords);
        }

        [HttpGet("shelter/{shelterId}")]
        public async Task<IActionResult> GetByShelter(int shelterId)
        {
            var healthRecords = await healthRecordsManager.GetHealthRecordsByShelterAsync(shelterId);
            return Ok(healthRecords);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HealthRecordDto dto)
        {
            var created = await healthRecordsManager.AddHealthRecordAsync(dto);
            return CreatedAtAction(nameof(GetByPet), new { petId = dto.PetId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] HealthRecordDto dto)
        {
            var updated = await healthRecordsManager.UpdateHealthRecordAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }
    }
}