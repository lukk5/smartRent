using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace smartRent.Repo.RepoInterfaces
{
    public interface IRepository<T> where T: class
    {
        Task<bool> CreateAsync(T entity);
        Task<T> GetByIdAsync(Guid guid);
        Task<bool> RemoveByIdAsync(Guid id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<bool> UpdateAsync(T entity);
    }
}