using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace smartRent.Repo.RepoInterfaces
{
    public interface IFileRepository
    {
        byte[] GetFileContentByName(string fileName);
        Task WriteFile(IFormFile file, string fileName);
        Task WriteFile(byte[] file, string fileName);
        void RemoveFileByName(string fileName);
    }
}