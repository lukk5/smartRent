namespace smartRent.BackEnd.Domain.Models
{
    public class BillDTO 
    {
        public string Id { get; set; }
        public string RentId { get; set; }
        public string RentObjectId { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string TenantName { get; set; }
        public string ObjectName { get; set; }
        public string TenantId { get; set; }
        public bool Paid { get; set; }
        public decimal Amount { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
        public string PaymentDate { get; set; }
        public bool FileExist { get; set; }
        public string BillType { get; set; }
    }
}