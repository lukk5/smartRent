using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace smartRent.Repo.RepoInterfaces
{
    public interface IFileRepository
    {
        Task<byte[]> GetFileContentByName(string fileName);
        Task WriteFile(IFormFile file, string fileName);
        void RemoveFileByName(string fileName);
    }
}