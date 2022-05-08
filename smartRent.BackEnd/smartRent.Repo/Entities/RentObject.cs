using System;
using System.Collections.Generic;
using smartRent.Repo.Enums;

namespace smartRent.Repo.Entities
{
    public class RentObject: BaseEntity
    {
        public Guid LandLordId { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Address { get; set; }
        public ObjectType Type { get; set; }
        public decimal Dimensions { get; set; }
        public decimal Price { get; set; }
        public Currency Currency { get; set; }
        public IEnumerable<Document> Documents { get; set; }
        public IEnumerable<Rent> Rent { get; set; }
    }
}