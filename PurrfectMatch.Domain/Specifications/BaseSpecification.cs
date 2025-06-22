using PurrfectMatch.Domain.Interfaces.Specifications;
using System.Linq.Expressions;

namespace PurrfectMatch.Domain.Specifications

{

    public class BaseSpecification<T> : ISpecification<T>

    {

        public Expression<Func<T, bool>> Criteria { get; protected set; }

        public List<Expression<Func<T, object>>> Includes { get; } = new();
        public List<string> IncludeStrings { get; } = [];

        public Expression<Func<T, object>> OrderBy { get; private set; }

        public Expression<Func<T, object>> OrderByDescending { get; private set; }

        public int Take { get; private set; }

        public int Skip { get; private set; }

        public bool IsPagingEnabled { get; private set; }


        protected BaseSpecification(Expression<Func<T, bool>> criteria)

        {

            Criteria = criteria;

        }


        protected void AddInclude(Expression<Func<T, object>> include)

            => Includes.Add(include);


        protected void AddInclude(string includeString)

            => IncludeStrings.Add(includeString);


        protected void ApplyPaging(int pageNumber, int pageSize)
        {
            pageNumber = Math.Max(1, pageNumber);
            pageSize = pageSize <= 0 ? 10 : pageSize;

            Skip = (pageNumber - 1) * pageSize;
            Take = pageSize;
            IsPagingEnabled = true;
        }


        protected void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)

            => OrderBy = orderByExpression;


        protected void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression)

            => OrderByDescending = orderByDescendingExpression;

    }

}