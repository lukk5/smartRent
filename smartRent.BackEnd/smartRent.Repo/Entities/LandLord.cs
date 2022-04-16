using System.Collections.Generic;

namespace smartRent.Repo.Entities
{
    public class LandLord: User
    {
        public virtual IEnumerable<RentObject>? RentObjects { get; set; }
    }
}