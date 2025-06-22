using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Specifications.Pets.Attributes.ActivityLevels;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.ActivityLevels;

namespace PurrfectMatch.Application.Managers.Pets.Attributes;

public class ActivityLevelsManager
{
    private readonly IBaseRepository<ActivityLevel> _repository;
    private readonly IMapper _mapper;

    public ActivityLevelsManager(IBaseRepository<ActivityLevel> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ActivityLevelDto> CreateActivityLevelAsync(ActivityLevelDto dto)
    {
        var entity = _mapper.Map<ActivityLevel>(dto);
        await _repository.CreateAsync(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<ActivityLevelDto>(entity);
    }

    public async Task<ActivityLevelDto?> GetActivityLevelAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        return entity == null ? null : _mapper.Map<ActivityLevelDto>(entity);
    }

    public async Task<IReadOnlyList<ActivityLevelDto>> GetActivityLevelsAsync(ActivityLevelFilterDto filter)
    {
        var spec = new ActivityLevelsFilterSpecification(filter);
        var entities = await _repository.ListAsync(spec);
        return _mapper.Map<IReadOnlyList<ActivityLevelDto>>(entities);
    }

    public async Task<ActivityLevelDto?> UpdateActivityLevelAsync(int id, ActivityLevelDto dto)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return null;
        _mapper.Map(dto, entity);
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<ActivityLevelDto>(entity);
    }

    public async Task<bool> DeleteActivityLevelAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return false;
        _repository.Delete(entity);
        await _repository.SaveChangesAsync();
        return true;
    }
}
