using System;
using System.IO;

namespace smartRent.Repo.Entities
{
    public class Bills : BaseDocument
    {
        public string UniqueFileName { get; set; }
        public Guid RentId { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public bool Paid { get; set; }
        public decimal Amount { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public DateTime? PaymentDate { get; set; }
    }
}