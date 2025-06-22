using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers.Pets;
using PurrfectMatch.Application.Managers.Pets.Attributes;
using PurrfectMatch.Shared.DTOs.Pets;
using System.Globalization;
using AutoMapper;

namespace PurrfectMatch.Api.Controllers
{
    public class PetsController(
        PetsManager petsManager,
        SpeciesManager speciesManager,
        BreedsManager breedsManager,
        ActivityLevelsManager activityLevelsManager,
        HealthStatusesManager healthStatusesManager,
        ColorsManager colorsManager,
        CoatLengthsManager coatLengthsManager,
        IMapper mapper) : BaseApiController
    {        [HttpGet]
        public async Task<IActionResult> GetFilteredPets([FromQuery] PetFilterDto filter)
        {
            var paginatedResponse = await petsManager.GetFilteredPetsPaginatedAsync(filter);
            return Ok(paginatedResponse);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var petDto = await petsManager.GetPetDetailsAsync(id);
                return Ok(petDto);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePetDto petDto)
        {
            var petId = await petsManager.AddPetAsync(petDto);
            return CreatedAtAction(nameof(GetById), new { id = petId }, petId);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePetDto updatePetDto)
        {
            var pet = await petsManager.UpdatePetAsync(id, updatePetDto);
            if (pet == null) return NotFound();
            var petDto = mapper.Map<PetDto>(pet);
            return Ok(petDto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await petsManager.SoftDeletePetAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpDelete("soft/{id}")]
        public async Task<IActionResult> SoftDelete(int id)
        {
            var result = await petsManager.SoftDeletePetAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("import")]
        public async Task<IActionResult> ImportPets(IFormFile file, [FromQuery] int shelterId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
                return BadRequest("File must be a CSV");

            try
            {
                var petDtos = new List<CreatePetDto>();

                using (var reader = new StreamReader(file.OpenReadStream()))
                using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
                {
                    var records = csv.GetRecords<PetCsvImportModel>();
                    foreach (var record in records)
                    {
                        var petDto = record.ToCreatePetDto(shelterId);
                        petDtos.Add(petDto);
                    }
                }

                var createdPetIds = await petsManager.BatchCreatePetsAsync(
                    petDtos
                );
                return Ok(new { Message = $"Successfully imported {createdPetIds.Count()} pets", PetIds = createdPetIds });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error importing pets: {ex.Message}");
            }
        }

        [HttpPost("{petId}/images")]
        public async Task<IActionResult> UploadPetImage(int petId, IFormFile file)
        {
            try
            {
                var url = await petsManager.UploadPetImageAsync(petId, file);
                return Ok(new { Url = url });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{petId}/images/{photoId}")]
        public async Task<IActionResult> GetPetImage(int petId, int photoId)
        {
            try
            {
                var stream = await petsManager.GetPetImageAsync(petId, photoId);
                return File(stream, "image/jpeg");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{petId}/images/{photoId}")]
        public async Task<IActionResult> DeletePetImage(int petId, int photoId)
        {
            try
            {
                await petsManager.DeletePetImageAsync(petId, photoId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}


