using Microsoft.AspNetCore.Http;

namespace smartRent.BackEnd.Domain.ViewModels
{
    public class BillRow
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool Paid { get; set; }
    }

    public class BillTableItem
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool Paid { get; set; }
        public string StartingDate { get; set; }
        public string EndDate { get; set; }
        public string TenantName { get; set; }
    }

    public class BillFile
    {
        public string Id { get; set; }
        public IFormFile File { get; set; }
    }

    public class BillFileResponse
    {
        public string FileName { get; set; }
        public byte[] File { get; set; }
    }
}