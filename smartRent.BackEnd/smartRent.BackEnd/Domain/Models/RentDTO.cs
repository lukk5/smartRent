namespace smartRent.BackEnd.Domain.Models
{
    public class RentDTO
    {
        public string Id { get; set; }
        public string TenantId { get; set; }
        public string RentObjectId { get; set; }
        public bool Active { get; set; }
        public string StartingDate { get; set; }
        public string EndingDate { get; set; }
    }
}