using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using smartRent.Repo.Context;
using smartRent.Repo.RepoInterfaces;

namespace smartRent.Repo.Repo
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly SmartRentDbContext _context;
        
        public Repository(SmartRentDbContext context)
        {
            _context = context;
        }
        
        public async Task<bool> CreateAsync(T entity)
        {
            await _context.AddAsync(entity);
            return await _context.SaveChangesAsync() == 1;
        }

        public async Task<T> GetByIdAsync(Guid id)
        {
            return await _context.FindAsync<T>(id);
        }

        public async Task<bool> RemoveByIdAsync(Guid id)
        {
            var entity = await GetByIdAsync(id);

            if (entity is null)
                return false;
            
            _context.Set<T>().Remove(entity);
            return await _context.SaveChangesAsync() == 1;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<bool> UpdateAsync(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            return await _context.SaveChangesAsync() == 1;
        }
    }
}