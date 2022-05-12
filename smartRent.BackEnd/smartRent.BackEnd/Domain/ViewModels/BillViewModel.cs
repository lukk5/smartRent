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
}