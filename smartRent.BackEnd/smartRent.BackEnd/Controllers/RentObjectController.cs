using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.Models;
using smartRent.BackEnd.Domain.ViewModels;
using smartRent.BackEnd.Utils;
using smartRent.Repo.Entities;
using smartRent.Repo.Enums;
using smartRent.Repo.RepoInterfaces;
using smartRent.Repo.Utils;

namespace smartRent.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentObjectController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IRepository<RentObject> _repository;
        private readonly IRepository<Rent> _rentRepository;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly IRepository<LandLord> _landLordRepository;
        private readonly IFileRepository _fileRepository;
        private readonly IRepository<Bills> _billRepository;
        private readonly IRepository<Document> _documentRepository;

        public RentObjectController(IMapper mapper, IRepository<RentObject> repository,
            IRepository<LandLord> landLordRepository, IRepository<Tenant> tenantRepository,
            IRepository<Rent> rentRepository, IRepository<Bills> billRepository, IFileRepository fileRepository,
            IRepository<Document> documentRepository)
        {
            _mapper = mapper;
            _repository = repository;
            _landLordRepository = landLordRepository;
            _tenantRepository = tenantRepository;
            _rentRepository = rentRepository;
            _billRepository = billRepository;
            _fileRepository = fileRepository;
            _documentRepository = documentRepository;
        }

        [HttpGet]
        [Route("getRentDetailsById/{id}")]
        public async Task<IActionResult> GetRentDetails([FromRoute] string id)
        {
            var rent = await _rentRepository.GetAllAsync();
            var targetRent = rent.SingleOrDefault(x => x.RentObjectId == Guid.Parse(id) && x.Active);

            if (targetRent is null) return NotFound();

            var tenant = await _tenantRepository.GetByIdAsync(targetRent.TenantId);

            var bills = await _billRepository.GetAllAsync();

            var targetBills = bills.Where(x => x.RentId == targetRent.Id);

            var debtExist = false;

            foreach (var bill in targetBills)
            {
                if (!bill.Paid && bill.ValidTo <= DateTime.Now) debtExist = true;
            }

            return Ok(new RentViewModel
            {
                Id = targetRent.Id.ToString(),
                HasDebt = debtExist,
                TenantName = tenant.Name + " " + tenant.LastName,
                StartDate = targetRent.StartingDate.ToString("yyyy-MM-dd"),
                EndDate = targetRent.EndingDate.ToString("yyyy-MM-dd")
            });
        }


        [HttpGet]
        [Route("getByLandLordId/{landLordId}")]
        [Authorize]
        public async Task<IActionResult> GetAllByLandlordId([FromRoute] string landLordId)
        {
            return await Try.Action(async () =>
            {
                var rentObjects = await _repository.GetAllAsync();

                var rents = await _rentRepository.GetAllAsync();

                var dtos = _mapper.Map<IEnumerable<RentObject>, IEnumerable<RentObjectDTO>>(
                    rentObjects.Where(x => x.LandLordId == Guid.Parse(landLordId)));

                foreach (var rent in dtos)
                {
                    rent.RentExist = rents.FirstOrDefault(x => x.RentObjectId == Guid.Parse(rent.Id)) is not null;
                }

                return Ok(dtos);
            }).Finally(10);
        }

        [HttpGet]
        [Route("getByTenantId/{tenantId}")]
        [Authorize]
        public async Task<IActionResult> GetAllByTenantId([FromRoute] string tenantId)
        {
            return await Try.Action(async () =>
            {
                var rentsAll = await _rentRepository.GetAllAsync();
                var targetRents = rentsAll.Where(x => x.TenantId == Guid.Parse(tenantId));
                var rentObjectsAll = await _repository.GetAllAsync();
                var result = targetRents
                    .Select(targetRent => rentObjectsAll.SingleOrDefault(x => x.Id == targetRent.RentObjectId))
                    .ToList();

                return Ok(_mapper.Map<IEnumerable<RentObject>, IEnumerable<RentObjectDTO>>(result));
            }).Finally(10);
        }

        [HttpPost]
        [Route("createRent")]
        [Authorize]
        public async Task<IActionResult> CreateRent([FromBody] RentDTO rentDto)
        {
            var rent = _mapper.Map<RentDTO, Rent>(rentDto);
            
            rent.CreatedAt = DateTime.Now;
            rent.CreatedBy = "system";

            var rents = await _rentRepository.GetAllAsync();

            foreach (var currentRents in rents.Where(x=> x.Active && rent.RentObjectId == x.RentObjectId))
            {
                currentRents.Active = false;
                await _rentRepository.UpdateAsync(currentRents);
            }

            await _rentRepository.CreateAsync(rent);
            return Ok();
        }

        [HttpGet]
        [Route("getRentById/{id}")]
        [Authorize]
        public async Task<IActionResult> GetRentById([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var rentObject = await _repository.GetByIdAsync(Guid.Parse(id));
                if (rentObject is null) throw CustomException.ObjectNullException(rentObject);

                var rents = await _rentRepository.GetAllAsync();

                var rent = rents.SingleOrDefault(x => x.RentObjectId == rentObject.Id && x.Active);

                return Ok(_mapper.Map<Rent, RentDTO>(rent));
            }).Finally(10);
        }


        [HttpGet]
        [Route("getById/{id}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var rentObject = await _repository.GetByIdAsync(Guid.Parse(id));

                if (rentObject is null)
                    throw CustomException.ObjectNullException(rentObject);

                return Ok(_mapper.Map<RentObject, RentObjectDTO>(rentObject));
            }).Finally(10);
        }

        [HttpGet]
        [Route("getForHeaderByUserId/{id}")]
        [Authorize]
        public async Task<IActionResult> GetForHeaderById([FromRoute] string id)
        {
            var user = await _tenantRepository.GetByIdAsync(Guid.Parse(id));

            if (user is null)
            {
                return NotFound("User not exists.");
            }

            var rentsAll = await _rentRepository.GetAllAsync();
            var targetRents = rentsAll.Where(x => x.TenantId == Guid.Parse(id));
            var rentObjectsAll = await _repository.GetAllAsync();
            var targetRentObjects = targetRents
                .Select(targetRent => rentObjectsAll.SingleOrDefault(x => x.Id == targetRent.RentObjectId)).ToList();

            var result = targetRentObjects.Select(rentObject =>
                (RentObjectViewModel) new() {Id = rentObject.Id.ToString(), Name = rentObject.Name}).ToList();

            return Ok(result);
        }

        [HttpDelete]
        [Authorize]
        [Route("deleteRentObjectById/{id}")]
        public async Task<IActionResult> DeleteRentObjectById([FromRoute] string id)
        {
            var targetRentObject = await _repository.GetByIdAsync(Guid.Parse(id));

            var rents = await _rentRepository.GetAllAsync();

            var bills = await _billRepository.GetAllAsync();

            var targetRents = rents.Where(x => x.RentObjectId == targetRentObject.Id);

            foreach (var rent in targetRents)
            {
                var targetBills = bills.Where(x => x.RentId == rent.Id).ToList();

                if (!targetBills.Any()) continue;
                foreach (var bill in targetBills.Where(bill => bill.UniqueFileName is not null))
                {
                    _fileRepository.RemoveFileByName(bill.UniqueFileName);
                }
            }

            var documents = await _documentRepository.GetAllAsync();

            foreach (var targetDocument in documents.Where(x =>
                x.RentObjectId == targetRentObject.Id && x.UniqueFileName is not null))
            {
                _fileRepository.RemoveFileByName(targetDocument.UniqueFileName);
            }

            await _repository.RemoveByIdAsync(targetRentObject.Id);

            return Ok();
        }


        [HttpPost]
        [Route("createRentObject")]
        [Authorize]
        public async Task<IActionResult> CreateRentObject([FromBody] RentObjectDTO rentObjectDto)
        {
            var rentObject = _mapper.Map<RentObjectDTO, RentObject>(rentObjectDto);

            rentObject.CreatedAt = DateTime.Now;
            rentObject.CreatedBy = "system";

            await _repository.CreateAsync(rentObject);

            return Ok();
        }


        [HttpPut]
        [Route("updateRent")]
        [Authorize]
        public async Task<IActionResult> UpdateRent([FromBody] RentDTO rentDto)
        {
            return await Try.Action(async () =>
            {
                var targetRent = await _rentRepository.GetByIdAsync(Guid.Parse(rentDto.Id));

                if (targetRent is null) CustomException.ObjectNullException(targetRent);

                targetRent.EndingDate = DateTime.Parse(rentDto.EndingDate);
                targetRent.Active = rentDto.Active;

                await _rentRepository.UpdateAsync(targetRent);

                return Ok();
            }).Finally(10);
        }

        [HttpPut]
        [Route("updateRentObject")]
        [Authorize]
        public async Task<IActionResult> UpdateRentObject([FromBody] RentObjectDTO rentObjectDto)
        {
            return await Try.Action(async () =>
            {
                var targetRentObject = await _repository.GetByIdAsync(Guid.Parse(rentObjectDto.Id));

                if (targetRentObject is null) CustomException.ObjectNullException(targetRentObject);

                targetRentObject.Currency = (Currency) Enum.Parse(typeof(Currency), rentObjectDto.Currency, true);
                targetRentObject.Price = rentObjectDto.Price;
                targetRentObject.Title = rentObjectDto.Title;

                await _repository.UpdateAsync(targetRentObject);
                return Ok();
            }).Finally(10);
        }

        [HttpGet]
        [Route("getRentsHistoryById/{id}")]
        [Authorize]
        public async Task<IActionResult> GetRentsHistoryById([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var rents = await _rentRepository.GetAllAsync();
                var tenants = await _tenantRepository.GetAllAsync();
                var targetRents = rents.Where(x => x.RentObjectId == Guid.Parse(id) && !x.Active).ToList();

                var targetTenants = targetRents
                    .Select(targetRent => tenants.SingleOrDefault(x => x.Id == targetRent.TenantId))
                    .Where(tenant => tenant is not null).ToList();
                var result = (from targetRent in
                        targetRents
                    let targetTenant = targetTenants.FirstOrDefault(x => x.Id == targetRent.TenantId)
                    select (RentViewForTable)
                        new()
                        {
                            Id = targetRent.Id.ToString(), EndDate = targetRent.EndingDate.ToShortDateString(),
                            TenantName = targetTenant.Name + " " + targetTenant.LastName
                        }).ToList();
                return Ok(result);
            }).Finally(10);
        }
    }
}