using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using smartRent.Repo.Entities;
using smartRent.Repo.RepoInterfaces;
using SendGrid.Helpers.Mail;

namespace smartRent.Reminder
{
    public class Reminder
    {
        private readonly IRepository<Bills> _repository;

        public Reminder(IRepository<Bills> repository)
        {
            _repository = repository;
        }

        [FunctionName("SendEmailForNotPaidBills")]
        public void Run([TimerTrigger("0 */5 * * * *")]TimerInfo myTimer, ILogger log,
            [SendGrid(ApiKey = "SendGridApiKey")] out SendGridMessage message1)
        {

            if (ReferenceEquals(_repository, null)) return;

            var msg = new SendGridMessage()



        }
    }
}
