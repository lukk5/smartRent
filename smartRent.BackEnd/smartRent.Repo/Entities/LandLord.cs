using System.Collections.Generic;

namespace smartRent.Repo.Entities
{
    public class LandLord: User
    {
        public IEnumerable<RentObject> RentObjects { get; set; }
    }
}