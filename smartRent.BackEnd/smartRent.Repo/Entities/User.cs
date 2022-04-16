
namespace smartRent.Repo.Entities
{
    public abstract class User : BaseEntity
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
    }
}