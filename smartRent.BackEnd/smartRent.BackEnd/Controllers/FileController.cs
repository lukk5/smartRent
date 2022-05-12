using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
    public class FileController : ControllerBase
    {
        private readonly IFileRepository _fileRepository;
        private readonly IRepository<Bills> _billRepository;
        private readonly IRepository<Document> _documentRepository;

        public FileController(IFileRepository fileRepository, IRepository<Document> documentRepository,
            IRepository<Bills> billRepository)
        {
            _fileRepository = fileRepository;
            _documentRepository = documentRepository;
            _billRepository = billRepository;
        }
        
        
        
        [HttpGet]
        [Route("getFileName/{id}/{type}")]
        [Authorize]
        public async Task<IActionResult> GetFileNameById([FromRoute] string id, [FromRoute] string type)
        {
            return await Try.Action(async () =>
            {
                if (type is "bill")
                {
                    var targetBill = await _billRepository.GetByIdAsync(Guid.Parse(id));

                    if (targetBill is null) CustomException.ObjectNullException(targetBill);
                
                    return Ok(new FileDTO() { FileName = targetBill.UniqueFileName, File = null});
                }
                
                var targetDocument = await _documentRepository.GetByIdAsync(Guid.Parse(id));

                if (targetDocument is null) CustomException.ObjectNullException(targetDocument);
                
                return Ok(new FileDTO() { FileName = targetDocument.UniqueFileName, File = null});

            }).Finally(10);
        }
        

        [HttpGet]
        [Route("getFileByName/${fileName}")]
        public async Task<IActionResult> GetFileByName([FromRoute] string fileName)
        {
            return await Try.Action(async () =>
            {
                var file = _fileRepository.GetFileContentByName(fileName);
                await Task.CompletedTask;
                return Ok(file);
            }).Finally(5);
        }

        [HttpGet]
        [Route("getFileById/{id}/{type}")]
        public async Task<IActionResult> GetFileById([FromRoute] string id, [FromRoute] string type)
        {
            switch (type)
            {
                case "document":
                {
                    var targetDocument = await _documentRepository.GetByIdAsync(Guid.Parse(id));
                    var file = _fileRepository.GetFileContentByName(targetDocument.UniqueFileName);

                    return Ok(file);
                }
                case "bill":
                {
                    var targetBill = await _billRepository.GetByIdAsync(Guid.Parse(id));
                    var file = _fileRepository.GetFileContentByName(targetBill.UniqueFileName);
                    //await _fileRepository.WriteFile(file, "baisusNiuhas.pdf"); 
                    return Ok(file);
                }
                default: return Ok();
            }
        }
        
        [HttpPost]
        [Route("addFile")]
        [Authorize]
        public async Task<IActionResult> AddFile([FromForm] FileDTO file)
        {
            return await Try.Action(async () =>
            {
                var fileName = "";
                if (file.Type is "bill")
                {
                    var targetBill = await _billRepository.GetByIdAsync(Guid.Parse(file.Id));

                    if (targetBill is null) CustomException.ObjectNullException(targetBill);

                    fileName = $"{targetBill.Name + DateTime.Now.ToString("yyyyMMddHHmmss")}.pdf";

                    await _fileRepository.WriteFile(file.File, fileName);
                
                    targetBill.UniqueFileName = fileName;
                    await _billRepository.UpdateAsync(targetBill);
                    return Ok();
                }
                
                var targetDocument = await _documentRepository.GetByIdAsync(Guid.Parse(file.Id));

                if (targetDocument is null) CustomException.ObjectNullException(targetDocument);

                fileName = $"{targetDocument.Name + DateTime.Now.ToString("yyyyMMddHHmmss")}.pdf";

                await _fileRepository.WriteFile(file.File, fileName);
                
                targetDocument.UniqueFileName = fileName;
                await _documentRepository.UpdateAsync(targetDocument);
                return Ok();

            }).Finally(10);
        }
        
        [HttpDelete]
        [Route("deleteFile/{id}/{type}")]
        [Authorize]
        public async Task<IActionResult> RemoveFile([FromRoute] string id, [FromRoute] string type)
        {
            return await Try.Action(async () =>
            {
                if (type is "bill")
                {
                    var targetBill = await _billRepository.GetByIdAsync(Guid.Parse(id));

                    if (targetBill is null) CustomException.ObjectNullException(targetBill);

                    if (targetBill.UniqueFileName is null) CustomException.ObjectNullException(targetBill.UniqueFileName);
                
                    _fileRepository.RemoveFileByName(targetBill.UniqueFileName);

                    targetBill.UniqueFileName = null;

                    await _billRepository.UpdateAsync(targetBill);
                
                    return Ok();
                } 
                
                var targetDocument = await _documentRepository.GetByIdAsync(Guid.Parse(id));

                if (targetDocument is null) CustomException.ObjectNullException(targetDocument);

                if (targetDocument.UniqueFileName is null) CustomException.ObjectNullException(targetDocument.UniqueFileName);
                
                _fileRepository.RemoveFileByName(targetDocument.UniqueFileName);

                targetDocument.UniqueFileName = null;

                await _documentRepository.UpdateAsync(targetDocument);
                
                return Ok();
            }).Finally(10);
        }
        
    }
}