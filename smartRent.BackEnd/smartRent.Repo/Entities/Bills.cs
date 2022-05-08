using System;

namespace smartRent.Repo.Entities
{
    public class Bills : BaseDocument
    {
        public byte[] Content { get; set; }
        public Guid RentId { get; set; }
        public bool Paid { get; set; }
        public decimal Amount { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
    }
}