using System;

namespace smartRent.Repo.Entities
{
    public class Record : BaseEntity
    {
        public string Content { get; set; }
        public Guid RentId { get; set; }
        public DateTime ExpireTime { get; set; }
        public bool Visible { get; set; } = true;
    }
}