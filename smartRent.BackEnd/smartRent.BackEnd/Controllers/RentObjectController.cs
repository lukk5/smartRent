using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.Models;
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

        public RentObjectController(IMapper mapper, IBaseRepository<RentObject> repository)
        {
            _mapper = mapper;
            _repository = repository;
        }

        [HttpGet]
        [Route("getByLandLordId/{landLordId}")]
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
        public async Task<IActionResult> GetAllByTenantId([FromRoute] string tenantId)
        {
            return await Try.Action(async () =>
            {
                var rentObjectsAll = await _repository.GetAllAsync();
                return Ok(_mapper.Map<IEnumerable<RentObject>, IEnumerable<RentObjectDTO>>(rentObjectsAll
                    .Where(x => x.TenantId == Guid.Parse(tenantId)).ToList()));
            }).Finally(10);
        }

        [HttpPost]
        [Route("add")]
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
    }
}