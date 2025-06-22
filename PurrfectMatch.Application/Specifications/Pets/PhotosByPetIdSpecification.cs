using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;
using System.Linq.Expressions;

namespace PurrfectMatch.Application.Specifications.Pets
{
    public class PhotosByPetIdSpecification : BaseSpecification<PetPhoto>
    {
        public PhotosByPetIdSpecification(int petId)
            : base(photo => photo.PetId == petId)
        {
        }
    }
}