using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using smartRent.Repo.Context;
using smartRent.Repo.Entities;
using smartRent.Repo.Enums;
using smartRent.Repo.RepoInterfaces;


namespace smartRent.Repo.Repo
{
    public class UserRepository : IUserRepository
    {
        private readonly SmartRentDbContext _context;

        public UserRepository(SmartRentDbContext context)
        {
            _context = context;
        }
        
        public async Task<bool> RegisterLandLord(LandLord user, Credentials credentials)
        {
            await _context.LandLords.AddAsync(user);
            var firstTransaction = await _context.SaveChangesAsync();

            if (firstTransaction == 0)
                return false;

            var createdUser = await GetByFullNameAndType(user.Name, user.LastName, UserType.Landlord);

            if (createdUser is null)
                throw new ArgumentNullException(nameof(createdUser));

            credentials.UserId = createdUser.Id;
            
            await _context.Credentials.AddAsync(credentials);

            return await _context.SaveChangesAsync() == 1;
        }

        public async Task<bool> RegisterTenant(Tenant user, Credentials credentials)
        {
            await _context.Tenants.AddAsync(user);
            var firstTransaction = await _context.SaveChangesAsync();

            if (firstTransaction == 0)
                return false;
            
            var createdUser = await GetByFullNameAndType(user.Name, user.LastName, UserType.Tenant);

            if (createdUser is null)
                throw new ArgumentNullException(nameof(createdUser));

            credentials.UserId = createdUser.Id;

            await _context.Credentials.AddAsync(credentials);

            return await _context.SaveChangesAsync() == 1;
        }

        public async Task<User> GetByFullNameAndType(string name, string lastName, UserType userType)
        {
            User user = null;

            if (userType == UserType.Landlord)
                user = await _context.LandLords.SingleOrDefaultAsync(x => x.Name == name && x.LastName == lastName);
            else
                user = await _context.Tenants.SingleOrDefaultAsync(x => x.Name == name && x.LastName == lastName);

            return user;
        }

    }
}