
namespace smartRent.BackEnd.Domain.Models
{
    public class Profit
    {
        public float AllIncome { get; set; }
        public float AllBillsOutcome { get; set; }
        public bool Positive { get; set; }
        public int CountNotPaid { get; set; }
    }
}