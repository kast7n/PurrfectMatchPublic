using PurrfectMatch.Domain.Entities;
using PurrfectMatch.Domain.Interfaces.Specifications;
using System.Linq.Expressions;

namespace PurrfectMatch.Application.Specifications.AdoptionApplications
{
    public class AdoptionApplicationWithDetailsSpecification : ISpecification<AdoptionApplication>
    {
        public AdoptionApplicationWithDetailsSpecification(int applicationId)
        {
            Criteria = a => a.ApplicationId == applicationId;
            AddInclude(a => a.Pet);
            AddInclude("Pet.Shelter");
            AddInclude("Pet.Species");
        }

        public Expression<Func<AdoptionApplication, bool>> Criteria { get; }
        public List<Expression<Func<AdoptionApplication, object>>> Includes { get; } = new List<Expression<Func<AdoptionApplication, object>>>();
        public List<string> IncludeStrings { get; } = new List<string>();
        public Expression<Func<AdoptionApplication, object>>? OrderBy { get; private set; }
        public Expression<Func<AdoptionApplication, object>>? OrderByDescending { get; private set; }
        public int Take { get; private set; }
        public int Skip { get; private set; }
        public bool IsPagingEnabled { get; private set; }

        protected void AddInclude(Expression<Func<AdoptionApplication, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }

        protected void AddInclude(string includeString)
        {
            IncludeStrings.Add(includeString);
        }
    }
}
