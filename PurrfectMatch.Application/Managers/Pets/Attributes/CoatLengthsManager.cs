using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Specifications.Pets.Attributes.CoatLengths;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.CoatLength;

namespace PurrfectMatch.Application.Managers.Pets.Attributes;

public class CoatLengthsManager
{
    private readonly IBaseRepository<CoatLength> _repository;
    private readonly IMapper _mapper;

    public CoatLengthsManager(IBaseRepository<CoatLength> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<CoatLengthDto> CreateCoatLengthAsync(CoatLengthDto dto)
    {
        var entity = _mapper.Map<CoatLength>(dto);
        await _repository.CreateAsync(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<CoatLengthDto>(entity);
    }

    public async Task<CoatLengthDto?> GetCoatLengthAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        return entity == null ? null : _mapper.Map<CoatLengthDto>(entity);
    }

    public async Task<IReadOnlyList<CoatLengthDto>> GetCoatLengthsAsync(CoatLengthFilterDto filter)
    {
        var spec = new CoatLengthsFilterSpecification(filter);
        var entities = await _repository.ListAsync(spec);
        return _mapper.Map<IReadOnlyList<CoatLengthDto>>(entities);
    }

    public async Task<CoatLengthDto?> UpdateCoatLengthAsync(int id, CoatLengthDto dto)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return null;
        _mapper.Map(dto, entity);
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<CoatLengthDto>(entity);
    }

    public async Task<bool> DeleteCoatLengthAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return false;
        _repository.Delete(entity);
        await _repository.SaveChangesAsync();
        return true;
    }
}
