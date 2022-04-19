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
using smartRent.Repo.RepoInterfaces;
using smartRent.Repo.Utils;

namespace smartRent.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentObjectController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBaseRepository<RentObject> _repository;
        private readonly IBaseRepository<Tenant> _tenantRepository;
        private readonly IBaseRepository<LandLord> _landLordRepository;

        public RentObjectController(IMapper mapper, IBaseRepository<RentObject> repository, 
            IBaseRepository<LandLord> landLordRepository, IBaseRepository<Tenant> tenantRepository)
        {
            _mapper = mapper;
            _repository = repository;
            _landLordRepository = landLordRepository;
            _tenantRepository = tenantRepository;
        }

        [HttpGet]
        [Route("getByLandLordId/{landLordId}")]
        [Authorize]
        public async Task<IActionResult> GetAllByLandlordId([FromRoute] string landLordId)
        {
            return await Try.Action(async () =>
            {
                var rentObjectsAll = await _repository.GetAllAsync();
                return Ok(_mapper.Map<IEnumerable<RentObject>, IEnumerable<RentObjectDTO>>(rentObjectsAll
                    .Where(x => x.LandLordId == Guid.Parse(landLordId)).ToList()));
            }).Finally(10);
        }

        [HttpGet]
        [Route("getByTenantId/{tenantId}")]
        [Authorize]
        public async Task<IActionResult> GetAllByTenantId([FromRoute] string tenantId)
        {
            return await Try.Action(async () =>
            {
                var rentObjectsAll = await _repository.GetAllAsync();
                var result = _mapper.Map<IEnumerable<RentObject>, IEnumerable<RentObjectDTO>>(rentObjectsAll
                    .Where(x => x.TenantId == Guid.Parse(tenantId)).ToList());

                return Ok(result);
            }).Finally(10);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] RentObjectDTO rentObjectDto)
        {
            return await Try.Action(async () =>
            {
                var result = await _repository.CreateAsync(_mapper.Map<RentObjectDTO, RentObject>(rentObjectDto));

                if (result)
                    return Ok();

                throw new Exception();
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
                    throw ExceptionUtil.ObjectNullException(rentObject);

                return Ok(_mapper.Map<RentObject, RentObjectDTO>(rentObject));
            }).Finally(10);
        }

        [HttpGet]
        [Route("getForHeaderByUserId/{id}")]
        [Authorize]
        public async Task<IActionResult> GetForHeaderById([FromRoute] string id)
        {
            var user = await _tenantRepository.GetByIdAsync(Guid.Parse(id));

            if (user is null) return NotFound("User not exists.");

            var rentObjects = await _repository.GetAllAsync();

            var userRentObjects = rentObjects.Where(x => x.TenantId == user.Id);

            var result = userRentObjects.Select(rentObject => (RentObjectViewModel) new() {Id = rentObject.Id.ToString(), Name = rentObject.Name}).ToList();

            return Ok(result);
        }
    }
}