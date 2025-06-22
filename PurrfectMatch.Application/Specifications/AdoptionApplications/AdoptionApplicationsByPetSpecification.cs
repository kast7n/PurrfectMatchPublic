using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;

namespace PurrfectMatch.Application.Specifications.AdoptionApplications;

public class AdoptionApplicationsByPetSpecification : BaseSpecification<AdoptionApplication>
{
    public AdoptionApplicationsByPetSpecification(int petId)
        : base(application => application.PetId == petId)
    {
    }
}