using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.Models;
using smartRent.BackEnd.Domain.ViewModels;
using smartRent.BackEnd.Utils;
using smartRent.Repo.Entities;
using smartRent.Repo.RepoInterfaces;
using smartRent.Repo.Utils;

namespace smartRent.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BillController : ControllerBase
    {
        private readonly IRepository<Bills> _billRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IRepository<Rent> _rentRepository;
        private readonly IRepository<RentObject> _rentObjectRepository;
        private readonly IFileRepository _fileRepository;

        public BillController(IRepository<Bills> billRepository, IMapper mapper, IUserRepository userRepository,
            IRepository<Rent> rentRepository, IRepository<RentObject> rentObjectRepository, IFileRepository fileRepository)
        {
            _billRepository = billRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _rentRepository = rentRepository;
            _rentObjectRepository = rentObjectRepository;
            _fileRepository = fileRepository;
        }

        [HttpPost]
        [Authorize]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] BillDTO billDto)
        {
            return await Try.Action(async () =>
            {
                var bill = _mapper.Map<BillDTO, Bills>(billDto);
                var targetRentOjbect = await _rentObjectRepository.GetByIdAsync(Guid.Parse(billDto.RentObjectId));
                var rents = await _rentRepository.GetAllAsync();
                var targetRent = rents.SingleOrDefault(x => x.Active && x.RentObjectId == targetRentOjbect.Id);
                
                bill.CreatedAt = DateTime.Now;
                bill.CreatedBy = "system";
                bill.RentId = targetRent.Id;
                bill.PaymentDate = null;

                await _billRepository.CreateAsync(bill);
                
                return Ok();
            }).Finally(5);
        }

        [HttpPut]
        [Authorize]
        [Route("update")]
        public async Task<IActionResult> Update([FromBody] BillDTO bill)
        {
            return await Try.Action(async () =>
            {
                var targetBill = await _billRepository.GetByIdAsync(Guid.Parse(bill.Id));

                if (targetBill is not null)
                {
                    targetBill.Amount = bill.Amount;
                    targetBill.PaymentDate = bill.PaymentDate is not null ? DateTime.Parse(bill.PaymentDate) : null;
                    targetBill.Paid = bill.Paid;
                    targetBill.Title = targetBill.Title;
                    targetBill.ValidTo = DateTime.Parse(bill.ValidTo);

                    await _billRepository.UpdateAsync(targetBill);
                }
                else CustomException.ObjectNullException(targetBill);
                
                return Ok();
                
            }).Finally(5);
        }
        

        [HttpGet]
        [Authorize]
        [Route("getByRentIdForRows/{id}")]
        public async Task<IActionResult> GetByRentIdForRows([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var bills = await _billRepository.GetAllAsync();

                var targetBills = bills.Where(x => x.RentId == Guid.Parse(id)).ToList();

                var sortedBills = targetBills.OrderByDescending(x => x.ValidFrom);

                var result = sortedBills.Select(bill =>
                    (BillRow) new() {Id = bill.Id.ToString(), Name = bill.Name, Paid = bill.Paid}).ToList();

                return Ok(result.Take(5));
            }).Finally(10);
        }

        /*[HttpDelete]
        [Route("deleteFile/{id}")]
        [Authorize]
        public async Task<IActionResult> RemoveFile([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var targetBill = await _billRepository.GetByIdAsync(Guid.Parse(id));

                if (targetBill is null) CustomException.ObjectNullException(targetBill);

                if (targetBill.UniqueFileName is null) CustomException.ObjectNullException(targetBill.UniqueFileName);
                
                _fileRepository.RemoveFileByName(targetBill.UniqueFileName);

                targetBill.UniqueFileName = null;

                await _billRepository.UpdateAsync(targetBill);
                
                return Ok();
            }).Finally(10);
        }*/

        [HttpGet]
        [Route("getBillTableItemsByUserIdAndStatus/{id}/{status}")]
        [Authorize]
        public async Task<IActionResult> GetBillTableItemsByUserId([FromRoute] string id, string status)
        {
            return await Try.Action(async () =>
            {
                var bills = await _billRepository.GetAllAsync();
                var rentObjects =
                    (await _rentObjectRepository.GetAllAsync()).Where(x => x.LandLordId == Guid.Parse(id));
                var resultBills = new List<BillTableItem>();
                var rents = await _rentRepository.GetAllAsync();

                foreach (var rentObject in rentObjects)
                {
                    foreach (var rent in rents
                        .Where(x => x.RentObjectId == rentObject.Id && x.Active == bool.Parse(status)).ToList())
                    {
                        var tenant = await _userRepository.GetUserById(rent.TenantId);
                        var targetBills = bills.Where(x => x.RentId == rent.Id);
                        resultBills.AddRange(targetBills.Select(bill => (BillTableItem) new()
                        {
                            Id = bill.Id.ToString(),
                            TenantName = tenant.Name + " " + tenant.LastName,
                            EndDate = bill.ValidTo.ToShortDateString(),
                            Name = bill.Name,
                            Paid = bill.Paid,
                            StartingDate = bill.ValidFrom.ToShortDateString()
                        }));
                    }
                }

                return Ok(resultBills);
            }).Finally(10);
        }

        [HttpGet]
        [Route("getById/{id}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var bill = await _billRepository.GetByIdAsync(Guid.Parse(id));

                if (bill is null) CustomException.ObjectNullException(bill);
                var rent = await _rentRepository.GetByIdAsync(bill.RentId);
                var tenant = await _userRepository.GetUserById(rent.TenantId);
                var result = _mapper.Map<Bills, BillDTO>(bill);
                result.TenantName = tenant.Name + " " + tenant.LastName;
                result.FileExist = bill.UniqueFileName is not null;
                return Ok(result);
            }).Finally(10);
        }


        /*[HttpPost]
        [Route("addFile")]
        [Authorize]
        public async Task<IActionResult> AddFile([FromForm] BillFile billFile)
        {
            return await Try.Action(async () =>
            {
                var targetBill = await _billRepository.GetByIdAsync(Guid.Parse(billFile.Id));

                if (targetBill is null) CustomException.ObjectNullException(targetBill);

                var fileName = $"{targetBill.Name + DateTime.Now.ToString("yyyyMMddHHmmss")}.pdf";

                await _fileRepository.WriteFile(billFile.File, fileName);
                
                targetBill.UniqueFileName = fileName;
                await _billRepository.UpdateAsync(targetBill);

                return Ok();
            }).Finally(10);
        }*/
        
        [HttpDelete]
        [Route("remove/{id}")]
        [Authorize]
        public async Task<IActionResult> RemoveById([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var targetBill = await _billRepository.GetByIdAsync(Guid.Parse(id));

                if (targetBill is null) CustomException.ObjectNullException(targetBill);

                try
                {
                    _fileRepository.RemoveFileByName(targetBill.UniqueFileName);
                }
                catch (Exception e)
                {
                    
                }

                await _billRepository.RemoveByIdAsync(Guid.Parse(id));
                return Ok();
            }).Finally(5);
        }
    }
}