using System.ComponentModel.DataAnnotations;

namespace smartRent.BackEnd.Domain.ViewModels
{
    public class UserRegViewModel
    {
        [Required] public string FirstName { get; set; }

        [Required] public string LastName { get; set; }

        [Required] public string NickName { get; set; }

        [Required] public string Password { get; set; }

        [Required] public string Email { get; set; }

        [Required] public string Phone { get; set; }

        [Required] public bool isLandLord { get; set; }
    }

    public class UserValidateViewModel 
    {
        public  string NickName { get; set; }
        public string Email { get; set; }
    }
    
    public class UserLogViewModel
    {
         public string NickName { get; set; }

        public string Password { get; set; }
    }
}