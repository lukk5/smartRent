using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using smartRent.Repo.Entities;
using smartRent.Repo.RepoInterfaces;

namespace Reminder
{
    public class Reminder
    {
        private readonly IRepository<Bills> _billRepository;
        private readonly IRepository<Tenant> _tenantRepository;
        private readonly IRepository<Rent> _rentRepository;

        public Reminder(IRepository<Bills> billRepository, IRepository<Tenant> tenantRepository, IRepository<Rent> rentRepository)
        {
            _billRepository = billRepository;
            _tenantRepository = tenantRepository;
            _rentRepository = rentRepository;
        }

        [FunctionName("Reminder")]
        public async Task Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

            var client = new SendGridClient("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");
            var from = new EmailAddress("smartRent@smartRent.com");
       
            var tenants = await _tenantRepository.GetAllAsync(); 
            var bills = await _billRepository.GetAllAsync();
            var targetTenants = new List<Tenant>();
            var rents = await _rentRepository.GetAllAsync();

            var body = "Turite neapmokėtų sąskaitų, prašome peržiūrėti jas sistemoje ir apmokėti.";
            var subject = "Priminimas dėl neapmokėtų sąskaitų.";

            var notPaid = bills.Where(x => x.Paid == false && x.ValidTo <= DateTime.Now);


            foreach(var bill in notPaid)
            {
                var targetRent = rents.SingleOrDefault(x => x.Active && x.Id == bill.RentId);
                targetTenants.Add(tenants.SingleOrDefault(x => x.Id == targetRent.TenantId));
            }

            foreach(var tenant in targetTenants)
            {
                var msg = MailHelper.CreateSingleEmail(from, new EmailAddress(tenant.Email), subject, body, "");
                await client.SendEmailAsync(msg);
            }
        }
    }
}
