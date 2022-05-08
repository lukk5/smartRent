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

namespace smartRent.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IBaseRepository<Document> _repository;

        public DocumentController(IMapper mapper, IBaseRepository<Document> repository)
        {
            _mapper = mapper;
            _repository = repository;
        }

        [HttpPost]
        [Route("create")]
        [Authorize]
        public async Task<IActionResult> Create(DocumentDTO documentDto)
        {
            return await Try.Action(async () => Ok(await _repository.CreateAsync(_mapper.Map<DocumentDTO, Document>(documentDto)))).Finally(10);
        }

        [HttpGet]
        [Route("getByObjectId/{id}")]
        [Authorize]
        public async Task<IActionResult> GetByObjectId([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var documents = await _repository.GetAllAsync();
                var objectDocuments = documents.Where(x => x.RentObjectId == Guid.Parse(id));
                var result = objectDocuments.Select(document => (DocumentViewModelItem) new() {Id = document.Id.ToString(), Name = document.Name, Date = document.CreatedAt.ToString()}).ToList();
                return Ok(result);
            }).Finally(10);
        }

        [HttpGet]
        [Route("getById")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var document = await _repository.GetByIdAsync(Guid.Parse(id));

            if (document is null)
                return NotFound();

            var documentDTO = _mapper.Map<Document, DocumentDTO>(document);

            return Ok(documentDTO);
        }
    }
}

