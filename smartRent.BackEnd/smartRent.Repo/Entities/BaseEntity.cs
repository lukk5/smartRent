using System;

namespace smartRent.Repo.Entities
{
    public class BaseEntity : Auditable
    {
        public Guid Id { get; set; }
    }
}