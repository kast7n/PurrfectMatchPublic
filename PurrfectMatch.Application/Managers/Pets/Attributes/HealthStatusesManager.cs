using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Specifications.Pets.Attributes.HealthStatuses;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.HealthStatuses;

namespace PurrfectMatch.Application.Managers.Pets.Attributes;

public class HealthStatusesManager
{
    private readonly IBaseRepository<HealthStatus> _repository;
    private readonly IMapper _mapper;

    public HealthStatusesManager(IBaseRepository<HealthStatus> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<HealthStatusDto> CreateHealthStatusAsync(HealthStatusDto dto)
    {
        var entity = _mapper.Map<HealthStatus>(dto);
        await _repository.CreateAsync(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<HealthStatusDto>(entity);
    }

    public async Task<HealthStatusDto?> GetHealthStatusAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        return entity == null ? null : _mapper.Map<HealthStatusDto>(entity);
    }

    public async Task<IReadOnlyList<HealthStatusDto>> GetHealthStatusesAsync(HealthStatusFilterDto filter)
    {
        var spec = new HealthStatusesFilterSpecification(filter);
        var entities = await _repository.ListAsync(spec);
        return _mapper.Map<IReadOnlyList<HealthStatusDto>>(entities);
    }

    public async Task<HealthStatusDto?> UpdateHealthStatusAsync(int id, HealthStatusDto dto)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return null;
        _mapper.Map(dto, entity);
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<HealthStatusDto>(entity);
    }

    public async Task<bool> DeleteHealthStatusAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return false;
        _repository.Delete(entity);
        await _repository.SaveChangesAsync();
        return true;
    }
}
