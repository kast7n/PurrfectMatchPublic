using Microsoft.EntityFrameworkCore;
using PurrfectMatch.Domain.Interfaces;

namespace PurrfectMatch.Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly PurrfectMatchContext _context;

        public UnitOfWork(PurrfectMatchContext context)
        {
            _context = context;
        }

        public async Task BeginTransactionAsync()
        {
            await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            await _context.Database.CurrentTransaction?.CommitAsync()!;
        }

        public async Task RollbackTransactionAsync()
        {
            await _context.Database.CurrentTransaction?.RollbackAsync()!;
        }
    }
}