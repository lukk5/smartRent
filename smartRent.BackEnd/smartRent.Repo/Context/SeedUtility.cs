using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using smartRent.Repo.Entities;
using smartRent.Repo.RepoInterfaces;

namespace smartRent.Repo.Context
{
    public class SeedUtility
    {
        private readonly IBaseRepository<User> _userRepo;

        public SeedUtility(IBaseRepository<User> userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task SeedUsersAsyn()
        {
            List<Tenant> users = new()
            {
                GenerateRandomUser(),
                GenerateRandomUser(),
                GenerateRandomUser(),
                GenerateRandomUser(),
            };
        }

        private Tenant GenerateRandomUser()
        {
            var (name, lastName) = GenerateNames();
            return new()
            {
                Id = Guid.NewGuid(),
                Name = name,
                LastName = lastName,
                Email = GenerateEmail(name, lastName),
                Phone = GenerateRandomPhone()
            };
        }
        private static string GenerateEmail(string name, string lastName)
        {
            var domains = new[] {"@gmail.com", "@yahoo.com", "@outlook.com", "@yandex.com"};

            var rand = new Random(DateTime.Now.Second);

            return $"{name}.{lastName}+{domains[rand.Next(0, domains.Length - 1)]}";
        }
        
        public string GenerateRandomPhone()
        {
            const int length = 6;
            var random = new Random();
            var s = "+370";
            for (var i = 0; i < length; i++)
            {
                s = string.Concat(s, random.Next(10).ToString());
                                
            }
            return s;
        }
        
        
        private static (string, string) GenerateNames()
        {
            var firstName = "";
            var lastName = "";
            
            var maleNames = new[] { "aaron", "abdul", "abe", "abel", "abraham", "adam", "adan", "adolfo", "adolph", "adrian"};
            var femaleNames = new [] { "abby", "abigail", "adele", "adrian"};
            var lastNames = new [] { "abbott", "acosta", "adams", "adkins", "aguilar"};

            var rand = new Random(DateTime.Now.Second);
                
            firstName = rand.Next(1, 2) == 1 ? maleNames[rand.Next(0, maleNames.Length - 1)] : femaleNames[rand.Next(0, femaleNames.Length - 1)];

            rand = new Random(DateTime.Now.Second);

            lastName = lastNames[rand.Next(0, lastNames.Length - 1)];

            return (firstName, lastName);
        }
    }
}