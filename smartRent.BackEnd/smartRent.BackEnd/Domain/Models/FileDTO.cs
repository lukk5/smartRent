using Microsoft.AspNetCore.Http;

namespace smartRent.BackEnd.Domain.Models
{
    public class FileResponse
    {
        public string FileName { get; set; }
        public byte[] File { get; set; }
    }

    public class FileTest
    {
        public byte[] File { get; set; }
    }

    public class FileDTO
    {
        public string FileName { get; set; }
        public string Id { get; set; }
        public IFormFile File { get; set; }
        public string Type { get; set; }
    }
}