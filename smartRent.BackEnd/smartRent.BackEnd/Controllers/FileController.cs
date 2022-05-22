using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using smartRent.BackEnd.Domain.Models;
using smartRent.BackEnd.Utils;
using smartRent.DocumentHandler;
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
        private readonly IRepository<RentObject> _rentObjectRepository;
        private readonly IRepository<Rent> _rentRepository;
        private readonly IRepository<Tenant> _tentRepository;
        private readonly IRepository<LandLord> _landLordRepository;


        public FileController(IFileRepository fileRepository, IRepository<Document> documentRepository,
            IRepository<Bills> billRepository, IRepository<RentObject> rentObjectRepository, IRepository<Rent> rentRepository, IRepository<Tenant> tentRepository, IRepository<LandLord> landLordRepository)
        {
            _fileRepository = fileRepository;
            _documentRepository = documentRepository;
            _billRepository = billRepository;
            _rentObjectRepository = rentObjectRepository;
            _rentRepository = rentRepository;
            _tentRepository = tentRepository;
            _landLordRepository = landLordRepository;
        }

        [HttpPost]
        [Route("renderDocument/{id}")]
        public async Task<IActionResult> RenderDocument([FromRoute] string id)
        {
            var document = await _documentRepository.GetByIdAsync(Guid.Parse(id));

            if (document is null) return NotFound();

            var rentObject = await _rentObjectRepository.GetByIdAsync(document.RentObjectId);
            var rents = await _rentRepository.GetAllAsync();

            var targetRent = rents.SingleOrDefault(x => x.Active && x.RentObjectId == rentObject.Id);

            var tenant = await _tentRepository.GetByIdAsync(targetRent.TenantId);
            var landLord = await _landLordRepository.GetByIdAsync(rentObject.LandLordId);

            var documentHanlder = new HandleDocument();

            var fileName = document.Name + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf";

            documentHanlder.FillDocument( new ()
            {
                Address = rentObject.Address,
                Price = rentObject.Price.ToString(CultureInfo.InvariantCulture),
                TenantName = tenant.Name + " " + tenant.LastName,
                LandLordName = landLord.Name + " " + landLord.LastName,
                DocumentNr = document.Id.ToString()[..4],
                Date1 = document.CreatedAt.Year.ToString(),
                Date2 = document.CreatedAt.Month.ToString(),
                Date3 = document.CreatedAt.Day.ToString(),
                Date1Payment = targetRent.PayDate.Day.ToString(),
                Dimensions = rentObject.Dimensions.ToString(CultureInfo.InvariantCulture)
            },fileName);

            document.UniqueFileName = fileName;
            await _documentRepository.UpdateAsync(document);
            return Ok();
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
        [Authorize]
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

                if (targetDocument.UniqueFileName is not null)
                {
                    _fileRepository.RemoveFileByName(targetDocument.UniqueFileName);
                }

                await _documentRepository.UpdateAsync(targetDocument);
                
                return Ok();
            }).Finally(10);
        }
        
    }
}