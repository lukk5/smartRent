using smartRent.BackEnd.Domain.Models;

namespace smartRent.BackEnd.Domain.Services
{
    public interface IAuthService
    {
        public AuthData GetAuthData(string id);
    }
}