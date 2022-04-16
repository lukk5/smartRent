using System.Collections.Generic;
using smartRent.BackEnd.Domain.Models;

namespace smartRent.BackEnd.Domain.ViewModels
{
    public class Dashboard
    {
        public decimal? IncomeFromAll { get; set; }
        
        public decimal? ExpensesFromAll { get; set; }
        
        public decimal? CurrentInCome { get; set; }

        public IEnumerable<RentObjectDTO>? LateToPay { get; set; }
        public IEnumerable<RentObjectDTO>? Paided { get; set; }
        public IEnumerable<RecordDTO>? Records { get; set; }
    }
}