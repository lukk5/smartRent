namespace smartRent.BackEnd.Domain.Models
{
    public class UserContactViewModel : UserViewModel
    {
        public string Phone { get; set; }
        public string Email { get; set; }
    }

    public class UserPasswordViewModel : UserViewModel
    {
        public string Password { get; set; }
    }

    public abstract class UserViewModel
    {
        public string Id { get; set; }
        public string Type { get; set; }
    }
}