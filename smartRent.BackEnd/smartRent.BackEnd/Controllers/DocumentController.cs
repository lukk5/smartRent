using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.Models;
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
        public async Task<IActionResult> Create(DocumentDTO documentDto)
        {
            return await Try.Action(async () => Ok(await _repository.CreateAsync(_mapper.Map<DocumentDTO, Document>(documentDto)))).Finally(10);
        }
    }
}

