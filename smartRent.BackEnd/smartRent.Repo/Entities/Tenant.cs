using System.Collections.Generic;

namespace smartRent.Repo.Entities
{
    public class Tenant: User
    {
        public virtual IEnumerable<RentObject> RentObjects { get; set; }
        public virtual IEnumerable<Bills> Bills { get; set; }
    }
}