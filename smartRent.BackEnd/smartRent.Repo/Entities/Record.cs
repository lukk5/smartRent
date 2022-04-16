using System;

namespace smartRent.Repo.Entities
{
    public class Record : BaseEntity
    {
        public string Content { get; set; }
        public Guid RentObjectId { get; set; }
        public DateTime ExpireTime { get; set; }
        public bool Visible { get; set; } = true;
        public Guid LandLordId { get; set; }
    }
}