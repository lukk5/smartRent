using Microsoft.AspNetCore.Http;
namespace smartRent.BackEnd.Domain.ViewModels
{
    public class DocumentViewModelItem
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Date { get; set; }
        public string RentObjectId { get; set; }
    }

    public class DocumentFile
    {
        public string Id { get; set; }
        public IFormFile File { get; set; }
    }
    
}