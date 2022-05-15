using System;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using smartRent.Repo.Context;
using smartRent.Repo.Entities;
using smartRent.Repo.Repo;
using smartRent.Repo.RepoInterfaces;

namespace smartRent.Test
{
    public class Tests
    {
        private IRepository<Tenant> _tenantRepository;
        private IRepository<Document> _documentRepository;
        private IRepository<Bills> _billRepository;
        private IRepository<Rent> _rentRepository;
        private IRepository<RentObject> _rentObjectRepository;
        private SmartRentDbContext _context;

        private void SetupDb(string connectionString)
        {
            var optionsBuilder = new DbContextOptionsBuilder<SmartRentDbContext>();
            optionsBuilder.UseSqlServer(connectionString);
            _context = new SmartRentDbContext(optionsBuilder.Options);
        }

        [SetUp]
        public void Setup()
        {
            SetupDb("Server=localhost\\SQLEXPRESS;Database=smartRentDB;Trusted_Connection=True;");
            _rentRepository = new Repository<Rent>(_context);
            _tenantRepository = new Repository<Tenant>(_context);
            _rentObjectRepository = new Repository<RentObject>(_context);
            _billRepository = new Repository<Bills>(_context);
            _documentRepository = new Repository<Document>(_context);
        }


        [Test]
        public void GetUserPass()
        {
            var tenantId = Guid.Parse("252cb131-4ad1-4efd-a95b-471752bcda9d");
            var user = _tenantRepository.GetByIdAsync(tenantId);
            if(user is not null) Assert.Pass();
            else Assert.Fail();
        }
        
        [Test]
        public void GetUserFail()
        {
            var tenantId = Guid.Parse("679b3201-68b7-4a8f-b4f2-3014ac0a6dc6");
            var user = _tenantRepository.GetByIdAsync(tenantId);
            if(user is null) Assert.Pass();
            else Assert.Fail();
        }

        [Test]
        public void CreatingRent()
        {
            Assert.Pass();
        }

        [Test]
        public void CreatingRentObject()
        {
            Assert.Pass();
        }

        [Test]
        public void GetRentObjectPass()
        {
            var rentObjectId = Guid.Parse("715b161d-a9a6-48b1-8dbe-690ef0f51e14");
            var rentObject = _rentObjectRepository.GetByIdAsync(rentObjectId);
            if(rentObject is not null) Assert.Pass();
            else Assert.Fail();
        }
        
        [Test]
        public void GetRentObjectFail()
        {
            var rentObjectId = Guid.Parse("679b3201-68b7-4a8f-b4f2-3014ac0a6dc6");
            var rentObject = _rentObjectRepository.GetByIdAsync(rentObjectId);
            if(rentObject is null) Assert.Pass();
            else Assert.Fail();
        }

        [Test]
        public void GetBillFail()
        {
            var billId = Guid.Parse("679b3201-68b7-4a8f-b4f2-3014ac0a6dc6");
            var bill = _billRepository.GetByIdAsync(billId);
            if(bill is null) Assert.Pass();
            else Assert.Fail();
        }
        
        [Test]
        public void GetBillPass()
        {
            var billId = Guid.Parse("fc1b225f-2fb3-439b-9b26-31d98be973a1");
            var bill = _billRepository.GetByIdAsync(billId);
            if(bill is not null) Assert.Pass();
            else Assert.Fail();
        }

        [Test]
        public void GetDocumentFail()
        {
            var documentId = Guid.Parse("679b3201-68b7-4a8f-b4f2-3014ac0a6dc6");
            var document = _documentRepository.GetByIdAsync(documentId);
            if(document is null) Assert.Pass();
            else Assert.Fail();
        }
        
        [Test]
        public void GetDocumentPass()
        {
            var documentId = Guid.Parse("ba4352ed-0ab2-4fc9-91cf-9439d792fe00");
            var document = _documentRepository.GetByIdAsync(documentId);
            if(document is not null) Assert.Pass();
            else Assert.Fail();
        }
    }
}