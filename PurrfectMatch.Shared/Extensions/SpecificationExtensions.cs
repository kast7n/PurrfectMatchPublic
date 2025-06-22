using System;
using System.Linq.Expressions;


namespace PurrfectMatch.Shared.Extensions
{
    public static class SpecificationExtensions
    {
        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> expr1, Expression<Func<T, bool>> expr2)
        {
            var parameter = Expression.Parameter(typeof(T));

            var leftVisitor = new ReplaceExpressionVisitor(expr1.Parameters[0], parameter);
            var left = leftVisitor.Visit(expr1.Body) ?? throw new InvalidOperationException("Left expression is null");

            var rightVisitor = new ReplaceExpressionVisitor(expr2.Parameters[0], parameter);
            var right = rightVisitor.Visit(expr2.Body) ?? throw new InvalidOperationException("Right expression is null");

            return Expression.Lambda<Func<T, bool>>(
                Expression.AndAlso(left, right), parameter);
        }

        private class ReplaceExpressionVisitor(Expression oldValue, Expression newValue) : ExpressionVisitor
        {
            private readonly Expression _oldValue = oldValue ?? throw new ArgumentNullException(nameof(oldValue));
            private readonly Expression _newValue = newValue ?? throw new ArgumentNullException(nameof(newValue));

            public override Expression? Visit(Expression? node)
            {
                if (node == _oldValue)
                    return _newValue;
                return base.Visit(node);
            }
        }
    }
}
