using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.ViewModels;
using smartRent.BackEnd.Utils;
using smartRent.Repo.Entities;
using smartRent.Repo.RepoInterfaces;

namespace smartRent.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BillController: ControllerBase
    {
        private readonly IBaseRepository<Bills> _repository;
        private readonly IMapper _mapper;

        public BillController(IBaseRepository<Bills> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        [Route("getByRentIdForRows/{id}")]
        public async Task<IActionResult> GetByRentIdForRows([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var bills = await _repository.GetAllAsync();

                var targetBills = bills.Where(x => x.RentId == Guid.Parse(id)).ToList();

                var sortedBills = targetBills.OrderByDescending(x => x.ValidFrom);
        
                var result = sortedBills.Select(bill =>
                    (BillRow) new() {Id = bill.Id.ToString(), Name = bill.Name, Paid = bill.Paid}).ToList();

                return Ok(result.Take(5));

            }).Finally(10);
        }
    }
}