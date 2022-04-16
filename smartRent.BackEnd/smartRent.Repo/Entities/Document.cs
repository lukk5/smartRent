using System;
using smartRent.Repo.Enums;

namespace smartRent.Repo.Entities
{
    public class Document : BaseEntity
    {
        public byte[]? Content { get; set; }
        public DocumentType Type { get; set; }
        public Guid RentObjectId { get; set; }
    }
}