using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PurrfectMatch.Application.Specifications.Addresses;
using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.IRepositories.Base;
using PurrfectMatch.Shared.DTOs.Addresses;

namespace PurrfectMatch.Application.Managers
{
    public class AddressesManager
    {
        private readonly IBaseRepository<Address> _repository;
        private readonly IMapper _mapper;

        public AddressesManager(IBaseRepository<Address> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Address?> UpdateAddressAsync(int addressId, AddressDto addressDto)
        {
            var address = await _repository.GetAsync(addressId);
            if (address == null) return null;

            _mapper.Map(addressDto, address);
            _repository.Update(address);
            await _repository.SaveChangesAsync();
            return address;
        }

        public async Task<int> CreateAddressAsync(AddressDto addressDto)
        {
            var address = _mapper.Map<Address>(addressDto);
            await _repository.CreateAsync(address);
            await _repository.SaveChangesAsync();
            return address.AddressId;
        }

        public async Task<bool> DeleteAddressAsync(int addressId)
        {
            var address = await _repository.GetAsync(addressId);
            if (address == null) return false;
            _repository.Delete(address);
            await _repository.SaveChangesAsync();
            return true;
        }

        public async Task<Address?> GetAddressByIdAsync(int id)
        {
            return await _repository.GetAsync(id);
        }

        public async Task<IReadOnlyList<Address>> GetFilteredAddressesAsync(AddressFilterDto filter)
        {
            var spec = new AddressFilterSpecification(filter);
            return await _repository.ListAsync(spec);
        }
    }
}
