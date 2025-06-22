using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Specifications.Pets.Attributes.Colors;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.Specifications;
using PurrfectMatch.Shared.DTOs.Pets.Attributes.Colors;

namespace PurrfectMatch.Application.Managers.Pets.Attributes;

public class ColorsManager
{
    private readonly IBaseRepository<Color> _repository;
    private readonly IMapper _mapper;

    public ColorsManager(IBaseRepository<Color> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ColorDto> CreateColorAsync(ColorDto dto)
    {
        var entity = _mapper.Map<Color>(dto);
        await _repository.CreateAsync(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<ColorDto>(entity);
    }

    public async Task<ColorDto?> GetColorAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        return entity == null ? null : _mapper.Map<ColorDto>(entity);
    }

    public async Task<IReadOnlyList<ColorDto>> GetColorsAsync(ColorFilterDto filter)
    {
        var spec = new ColorsFilterSpecification(filter);
        var entities = await _repository.ListAsync(spec);
        return _mapper.Map<IReadOnlyList<ColorDto>>(entities);
    }

    public async Task<ColorDto?> UpdateColorAsync(int id, ColorDto dto)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return null;
        _mapper.Map(dto, entity);
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<ColorDto>(entity);
    }

    public async Task<bool> DeleteColorAsync(int id)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return false;
        _repository.Delete(entity);
        await _repository.SaveChangesAsync();
        return true;
    }
}
