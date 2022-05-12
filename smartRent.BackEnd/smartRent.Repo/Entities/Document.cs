using System;
using smartRent.Repo.Enums;

namespace smartRent.Repo.Entities
{
    public class Document : BaseDocument
    {
        public string UniqueFileName { get; set; }
        public DocumentType Type { get; set; }
        public Guid RentObjectId { get; set; }
    }
}