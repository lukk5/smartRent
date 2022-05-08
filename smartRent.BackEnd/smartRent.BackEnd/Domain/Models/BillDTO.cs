namespace smartRent.BackEnd.Domain.Models
{
    public class BillDTO 
    {
        public string Id { get; set; }
        public byte[] Content { get; set; }
        public string RentObjectId { get; set; }
        public bool Paid { get; set; }
        public decimal Amount { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
    }
}