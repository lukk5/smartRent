using System;
using System.Threading.Tasks;
using smartRent.Repo.Entities;
using smartRent.Repo.Enums;

namespace smartRent.Repo.RepoInterfaces
{
    public interface IUserRepository
    {
        Task<bool> RegisterLandLord(LandLord user, Credentials credentials);
        Task<bool> RegisterTenant(Tenant user, Credentials credentials);

        Task<User> GetByFullNameAndType(string name, string lastName, UserType userType);
        Task<User> GetUserById(Guid id);
    }
}