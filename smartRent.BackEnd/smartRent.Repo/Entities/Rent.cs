using System;
using System.Collections.Generic;

namespace smartRent.Repo.Entities
{
    public class Rent: BaseEntity
    {
        public Guid TenantId { get; set; }
        public Guid RentObjectId { get; set; }
        public DateTime PayDate { get; set; }
        public bool Active { get; set; }
        public DateTime StartingDate { get; set; }
        public DateTime EndingDate { get; set; }
        public IEnumerable<Bills> Bills { get; set; }
        public IEnumerable<Record> Records { get; set; }
    }
}