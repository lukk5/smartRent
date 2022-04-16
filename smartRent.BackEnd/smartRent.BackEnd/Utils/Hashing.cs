using Microsoft.AspNetCore.Identity;

namespace smartRent.BackEnd.Utils
{
    public static class Hashing
    {
        public static string HashPassword(string userName, string password)
        {
            var psw = new PasswordHasher<string>();
            return psw.HashPassword(userName, password);
        }
        public static bool VerifyHashedPassword(string userName, string hashedPassword, string password)
        {
            var psw = new PasswordHasher<string>();
            var result = psw.VerifyHashedPassword(userName, hashedPassword, password);

            return result == PasswordVerificationResult.Success;
        }
    }
}