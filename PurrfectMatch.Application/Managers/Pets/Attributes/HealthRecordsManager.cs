using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Domain.Interfaces.IRepositories;
using PurrfectMatch.Shared.DTOs.Pets.HealthRecords;

namespace PurrfectMatch.Application.Managers.Pets.Attributes;

public class HealthRecordsManager
{
    private readonly IBaseRepository<HealthRecord> _repository;
    private readonly IHealthRecordRepository _healthRecordRepository;
    private readonly IMapper _mapper;

    public HealthRecordsManager(
        IBaseRepository<HealthRecord> repository,
        IHealthRecordRepository healthRecordRepository,
        IMapper mapper)
    {
        _repository = repository;
        _healthRecordRepository = healthRecordRepository;
        _mapper = mapper;
    }

    public async Task<HealthRecordDto> AddHealthRecordAsync(HealthRecordDto dto)
    {
        var entity = _mapper.Map<HealthRecord>(dto);
        await _repository.CreateAsync(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<HealthRecordDto>(entity);
    }

    public async Task<HealthRecordDto?> UpdateHealthRecordAsync(int id, HealthRecordDto dto)
    {
        var entity = await _repository.GetAsync(id);
        if (entity == null) return null;
        _mapper.Map(dto, entity);
        _repository.Update(entity);
        await _repository.SaveChangesAsync();
        return _mapper.Map<HealthRecordDto>(entity);
    }

    public async Task<IReadOnlyList<HealthRecordDto>> GetHealthRecordsByPetAsync(int petId)
    {
        var records = await _healthRecordRepository.GetHealthRecordsByPetAsync(petId);
        return _mapper.Map<IReadOnlyList<HealthRecordDto>>(records);
    }

    public async Task<IReadOnlyList<HealthRecordDto>> GetHealthRecordsByShelterAsync(int shelterId)
    {
        var records = await _healthRecordRepository.GetHealthRecordsByShelterAsync(shelterId);
        return _mapper.Map<IReadOnlyList<HealthRecordDto>>(records);
    }
}
