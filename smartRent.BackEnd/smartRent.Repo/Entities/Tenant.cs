using System.Collections.Generic;

namespace smartRent.Repo.Entities
{
    public class Tenant: User
    {
        public IEnumerable<Rent> Rents { get; set; }
    }
}