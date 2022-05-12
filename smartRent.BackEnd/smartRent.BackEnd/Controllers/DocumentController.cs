using System;
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
    public class DocumentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IRepository<Document> _repository;
        private readonly IFileRepository _fileRepository;

        public DocumentController(IMapper mapper, IRepository<Document> repository, IFileRepository fileRepository)
        {
            _mapper = mapper;
            _repository = repository;
            _fileRepository = fileRepository;
        }

        [HttpDelete]
        [Route("remove/{id}")]
        [Authorize]
        public async Task<IActionResult> RemoveById([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var targetDocument = await _repository.GetByIdAsync(Guid.Parse(id));

                if (targetDocument is null) CustomException.ObjectNullException(targetDocument);

                try
                {
                    _fileRepository.RemoveFileByName(targetDocument.UniqueFileName);
                }
                catch (Exception e)
                {
                    
                }

                await _repository.RemoveByIdAsync(Guid.Parse(id));
                return Ok();
            }).Finally(5);
        }

        [HttpPost]
        [Route("create")]
        [Authorize]
        public async Task<IActionResult> Create(DocumentDTO documentDto)
        {
            return await Try.Action(async () =>
            {
                await _repository.CreateAsync(_mapper.Map<DocumentDTO, Document>(documentDto));

                var targetDocument = await _repository.GetByIdAsync(Guid.Parse(documentDto.Id));

                if (targetDocument is null) CustomException.ObjectNullException(targetDocument);

                return Ok();
            }).Finally(10);
        }

        [HttpPost]
        [Route("addFile")]
        [Authorize]
        public async Task<IActionResult> AddFile([FromForm] DocumentFile documentFile)
        {
            return await Try.Action(async () =>
            {
                var targetDocument = await _repository.GetByIdAsync(Guid.Parse(documentFile.Id));

                if (targetDocument is null) CustomException.ObjectNullException(targetDocument);

                var fileName = $"{targetDocument.Name + DateTime.Now.ToString("yyyyMMddHHmmss")}.pdf";

                await _fileRepository.WriteFile(documentFile.File, fileName);

                targetDocument.UniqueFileName = fileName;

                await _repository.UpdateAsync(targetDocument);

                return Ok();
            }).Finally(5);
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
                var result = objectDocuments.Select(document => (DocumentViewModelItem) new()
                    {Id = document.Id.ToString(), Name = document.Name, Date = document.CreatedAt.ToString()}).ToList();
                return Ok(result);
            }).Finally(10);
        }

        [HttpGet]
        [Route("getById/{id}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] string id)
        {
            var document = await _repository.GetByIdAsync(Guid.Parse(id));

            if (document is null)
                return NotFound();

            var documentDTO = _mapper.Map<Document, DocumentDTO>(document);

            return Ok(documentDTO);
        }

        [HttpGet]
        [Route("getTableItemsByRentObjectId/{id}")]
        [Authorize]
        public async Task<IActionResult> GetTableItemsByRentObjectId([FromRoute] string id)
        {
            return await Try.Action(async () =>
            {
                var allDocuments = await _repository.GetAllAsync();
                var targetDocuments = allDocuments.Where(x => x.RentObjectId == Guid.Parse(id));

                var result = targetDocuments.Select(document => (DocumentViewModelItem) new()
                    {
                        Id = document.Id.ToString(),
                        Name = document.Name,
                        Date = document.CreatedAt.ToString("yyyy-MM-dd"),
                        RentObjectId = document.RentObjectId.ToString(),
                        Type = document.Type.ToString()
                    })
                    .ToList();

                return Ok(result);
            }).Finally(5);
        }
    }
}