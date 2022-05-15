namespace smartRent.BackEnd.Domain.ViewModels
{
    public class RentViewModel
    {
        public string Id { get; set; }
        public string TenantName { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public bool HasDebt { get; set; }
        public string TenantId { get; set; }
    }

    public class RentViewForTable
    {
        public string Id { get; set; }
        public string EndDate { get; set; }
        public string TenantName { get; set; }
    }
}