using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.Models;
using smartRent.Repo.Entities;
using smartRent.Repo.Enums;
using smartRent.Repo.RepoInterfaces;

namespace smartRent.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashBoardController : ControllerBase
    {
        private readonly IRepository<RentObject> _rentObjectRepository;
        private readonly IRepository<Rent> _rentRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IRepository<Bills> _billRepository;
        private readonly IRepository<Tenant> _tenantRepository;

        public DashBoardController(IRepository<RentObject> rentObjectRepository, IMapper mapper,
            IRepository<Bills> billRepository, IUserRepository userRepository, IRepository<Rent> rentRepository, IRepository<Tenant> tenantRepository)
        {
            _rentObjectRepository = rentObjectRepository;
            _mapper = mapper;
            _billRepository = billRepository;
            _userRepository = userRepository;
            _rentRepository = rentRepository;
            _tenantRepository = tenantRepository;
        }

        [HttpGet]
        [Route("getNotPaidBillsByLandLordId/{id}")]
        [Authorize]
        public async Task<IActionResult> GetNotPaidBillsByLandLordId([FromRoute] string id)
        {
            var bills = (await _billRepository.GetAllAsync()).Where(x => !x.Paid && x.ValidTo <= DateTime.Now).ToList();
            var rents = (await _rentRepository.GetAllAsync()).ToList();
            var rentObjects = (await _rentObjectRepository.GetAllAsync()).ToList();
            var landLord = await _userRepository.GetUserById(Guid.Parse(id));
            var tenants = (await _tenantRepository.GetAllAsync()).ToList();

            var result = new List<BillDTO>();

            foreach (var bill in bills)
            {
                var targetRent = rents.SingleOrDefault(x => x.Id == bill.RentId);
                if (targetRent is null) continue;
                var targetRentObject = rentObjects.SingleOrDefault(x => x.Id == targetRent.RentObjectId && x.LandLordId == landLord.Id);
                if(targetRentObject is null) continue;
                var targetTenant = tenants.SingleOrDefault(x => x.Id == targetRent.TenantId);
                var billDto = _mapper.Map<Bills, BillDTO>(bill);
                billDto.TenantName = targetTenant.Name + " " + targetTenant.LastName;
                billDto.TenantId = targetTenant.Id.ToString();
                result.Add(billDto);
            }
            
            return Ok(result);
        }
        
        [HttpGet]
        [Route("getNotPaidBillsByRentObjectId/{id}")]
        [Authorize]
        public async Task<IActionResult> GetNotPaidBillsByTenantId([FromRoute] string id)
        {
            var bills = (await _billRepository.GetAllAsync()).Where(x => !x.Paid && x.ValidTo <= DateTime.Now).ToList();
            var rents = (await _rentRepository.GetAllAsync()).ToList();
            var targetRent = rents.SingleOrDefault(x => x.RentObjectId == Guid.Parse(id) && x.Active);
            var targetRentObject = await _rentObjectRepository.GetByIdAsync(targetRent.RentObjectId);
            var result = new List<BillDTO>();

            foreach (var bill in bills.Where(x => x.RentId == targetRent.Id))
            {
                var billDto = _mapper.Map<Bills, BillDTO>(bill);
                billDto.ObjectName = targetRentObject.Name;
                result.Add(billDto);
            }
            return Ok(result);
        }


        [HttpGet]
        [Authorize]
        [Route("getProfit/{id}")]
        public async Task<IActionResult> GetProfit([FromRoute] string id)
        {
            var bills = (await _billRepository.GetAllAsync()).ToList();
            var rents = (await _rentRepository.GetAllAsync()).ToList();
            var rentObjects = (await _rentObjectRepository.GetAllAsync()).ToList();

            float allIncome = 0;
            float allOutcome = 0;
            int notPaid = 0;

            foreach (var targetRentObject in rentObjects.Where(x => x.LandLordId == Guid.Parse(id)))
            {
                var targetRent = rents.SingleOrDefault(x => x.Active && x.RentObjectId == targetRentObject.Id);

                if (targetRent is null) continue;

                foreach (var targetBill in bills.Where(x => x.RentId == targetRent.Id))
                {
                    if (targetBill.BillType is BillType.Rent && targetBill.Paid) allIncome += (float) targetBill.Amount;
                    if (targetBill.BillType is BillType.Other && targetBill.ValidTo <= DateTime.Now && !targetBill.Paid)
                        allOutcome += (float) targetBill.Amount;
                    if (!targetBill.Paid && targetBill.ValidTo <= DateTime.Now) notPaid++;
                }
            }
            return Ok(new Profit()
            { 
                AllBillsOutcome = allOutcome,
                AllIncome = allIncome,
                CountNotPaid = notPaid,
                Positive = allIncome > allOutcome
            });
        }
    }
}