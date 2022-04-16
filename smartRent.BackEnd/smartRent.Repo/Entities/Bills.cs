using System;

namespace smartRent.Repo.Entities
{
    public class Bills : BaseEntity
    {
        public byte[] Content { get; set; }
        public Guid RentObjectId { get; set; }
        public bool Paid { get; set; }
        public decimal Amount { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
    }
}