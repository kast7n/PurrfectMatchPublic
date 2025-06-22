using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Specifications.Pets.Attributes.SpeciesAttribute;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Species;

namespace PurrfectMatch.Application.Managers.Pets.Attributes;

public class SpeciesManager
{
    private readonly IBaseRepository<Species> _repository;
    private readonly IMapper _mapper;

    public SpeciesManager(IBaseRepository<Species> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<SpeciesDto> CreateSpeciesAsync(SpeciesDto dto)
    {
        var entity = _mapper.Map<Species>(dto);
        await _repository.CreateAsync(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<SpeciesDto>(entity);
    }

    public async Task<SpeciesDto?> GetSpeciesAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        return entity == null ? null : _mapper.Map<SpeciesDto>(entity);
    }

    public async Task<IReadOnlyList<SpeciesDto>> GetSpeciesAsync(SpeciesFilterDto filter)
    {
        var spec = new SpeciesFilterSpecification(filter);
        var entities = await _repository.ListAsync(spec);
        return _mapper.Map<IReadOnlyList<SpeciesDto>>(entities);
    }

    public async Task<SpeciesDto?> UpdateSpeciesAsync(int id, SpeciesDto dto)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return null;
        _mapper.Map(dto, entity);
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<SpeciesDto>(entity);
    }

    public async Task<bool> DeleteSpeciesAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return false;
        _repository.Delete(entity);
        await _repository.SaveChangesAsync();
        return true;
    }
}
