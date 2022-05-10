using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.Models;
using smartRent.BackEnd.Domain.ViewModels;
using smartRent.BackEnd.Utils;
using smartRent.Repo.Entities;
using smartRent.Repo.RepoInterfaces;

namespace smartRent.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashBoardController : ControllerBase
    {
        private readonly IRepository<RentObject> _rentRepository;
        private readonly IRepository<Record> _recordRepository;
     
        private readonly IMapper _mapper;
        
        public DashBoardController(IRepository<RentObject> rentRepository, IMapper mapper, IRepository<Record> recordRepository)
        {
            _rentRepository = rentRepository;
            _mapper = mapper;
            _recordRepository = recordRepository;
        }
        
        [HttpGet]
        [Route("/landlord/dashboard")]
        public async Task<IActionResult> GetLandLordDashboard(Guid landLordId, [FromQuery] int pageSize)
        {
            return await Try.Action(async () =>
            {
                /*var rentObjects = (await _rentRepository.GetAllAsync()).Where(x => x.LandLordId == landLordId)
                    .OrderByDescending(x => x.CreatedAt).Take(pageSize).ToList();

                var incomeFromAll = rentObjects.Sum(x => x.Price);

                var expensesFromAll = rentObjects.Sum(x => x.Bills?.Where(y=> y.ValidTo >= DateTime.Now).Sum(y=> y.Amount));

                var currentInCome = rentObjects.Sum(x => x.Bills?.Where(y => y.Paid).Sum(z => z.Amount));

                var lateToPay = rentObjects.Where(x => x.Bills.Any(y => !y.Paid && y.ValidTo <= DateTime.Now)).OrderByDescending(x=> x.CreatedAt).Take(pageSize);

                var paided = rentObjects.Where(x => x.Bills.Any(y => y.Paid)).OrderByDescending(x=> x.CreatedAt).Take(pageSize);

                var records = (await _recordRepository.GetAllAsync()).Where(x => x.LandLordId == landLordId).OrderByDescending(x=> x.CreatedAt).Take(pageSize);
                
                return Ok(new Dashboard
                {
                    IncomeFromAll = incomeFromAll,
                    Paided = _mapper.Map<IEnumerable<RentObject>,IEnumerable<RentObjectDTO>>(paided),
                    LateToPay = _mapper.Map<IEnumerable<RentObject>,IEnumerable<RentObjectDTO>>(lateToPay),
                    CurrentInCome = currentInCome,
                    ExpensesFromAll = expensesFromAll,
                    Records = _mapper.Map<IEnumerable<Record>, IEnumerable<RecordDTO>>(records)

                });*/

                return Ok();
            }).Finally(10);
        }
    }
}