using System;
using Microsoft.AspNetCore.Mvc;
using PurrfectMatch.Application.Managers;
using PurrfectMatch.Shared.DTOs.Addresses;
using AutoMapper;

namespace PurrfectMatch.Api.Controllers;

public class AddressesController(AddressesManager addressesManager, IMapper mapper) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetFilteredAddresses([FromQuery] AddressFilterDto filter)
    {
        var addresses = await addressesManager.GetFilteredAddressesAsync(filter);
        var addressDtos = addresses.Select(a => mapper.Map<AddressDto>(a));
        return Ok(addressDtos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var address = await addressesManager.GetAddressByIdAsync(id);
        if (address == null) return NotFound();
        var addressDto = mapper.Map<AddressDto>(address);
        return Ok(addressDto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AddressDto addressDto)
    {
        var addressId = await addressesManager.CreateAddressAsync(addressDto);
        return CreatedAtAction(nameof(GetById), new { id = addressId }, addressId);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] AddressDto updateAddressDto)
    {
        var address = await addressesManager.UpdateAddressAsync(id, updateAddressDto);
        if (address == null) return NotFound();
        var addressDto = mapper.Map<AddressDto>(address);
        return Ok(addressDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await addressesManager.DeleteAddressAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
