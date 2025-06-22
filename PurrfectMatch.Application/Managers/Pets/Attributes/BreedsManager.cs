using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Specifications.Pets.Attributes.Breeds;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Breeds;

namespace PurrfectMatch.Application.Managers.Pets.Attributes;

public class BreedsManager
{
    private readonly IBaseRepository<Breed> _repository;
    private readonly IMapper _mapper;

    public BreedsManager(IBaseRepository<Breed> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<BreedDto> CreateBreedAsync(BreedDto dto)
    {
        var entity = _mapper.Map<Breed>(dto);
        await _repository.CreateAsync(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<BreedDto>(entity);
    }

    public async Task<BreedDto?> GetBreedAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        return entity == null ? null : _mapper.Map<BreedDto>(entity);
    }

    public async Task<IReadOnlyList<BreedDto>> GetBreedsAsync(BreedFilterDto filter)
    {
        var spec = new BreedsFilterSpecification(filter);
        var entities = await _repository.ListAsync(spec);
        return _mapper.Map<IReadOnlyList<BreedDto>>(entities);
    }

    public async Task<BreedDto?> UpdateBreedAsync(int id, BreedDto dto)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return null;
        _mapper.Map(dto, entity);
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<BreedDto>(entity);
    }

    public async Task<bool> DeleteBreedAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return false;
        _repository.Delete(entity);
        await _repository.SaveChangesAsync();
        return true;
    }
}
