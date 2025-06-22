using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Specifications;

namespace PurrfectMatch.Application.Specifications.ShelterSpecifications
{
    public class ShelterManagersByShelterId : BaseSpecification<ShelterManager>
    {
        public ShelterManagersByShelterId(int shelterId) : base(sm => sm.ShelterId == shelterId)
        {
            AddInclude(sm => sm.User);
            AddInclude(sm => sm.Shelter);
        }
    }
}
