namespace smartRent.BackEnd.Domain.Models
{
    public class RentObjectDTO 
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string LandLordId { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public decimal Dimensions { get; set; }
        public string Type { get; set; }
        public string Address { get; set; }
        public bool RentExist { get; set; }
    }
}