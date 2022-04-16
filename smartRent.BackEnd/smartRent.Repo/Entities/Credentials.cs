using System;

namespace smartRent.Repo.Entities
{
    public class Credentials : BaseEntity
    {
        public Guid UserId { get; set; }
        public string NickName { get; set; }
        public string Password { get; set; }
    }
}