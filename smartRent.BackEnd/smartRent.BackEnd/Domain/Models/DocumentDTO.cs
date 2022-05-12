namespace smartRent.BackEnd.Domain.Models
{
    public class DocumentDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string RentObjectId { get; set; }
    }
}