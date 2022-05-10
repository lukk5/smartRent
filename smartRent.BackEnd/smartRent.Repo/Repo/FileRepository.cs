using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using smartRent.Repo.RepoInterfaces;

namespace smartRent.Repo.Repo
{
    public class FileRepository: IFileRepository
    {
        private static readonly string FilesPath = Directory.GetCurrentDirectory() + "/data/";
        
        public async Task<byte[]> GetFileContentByName(string fileName)
        {
            return await File.ReadAllBytesAsync(FilesPath + fileName);
        }

        public async Task WriteFile(IFormFile file, string fileName)
        {
            var path = FilesPath + fileName;
            await using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);
        }

        public void RemoveFileByName(string fileName)
        {
            File.Delete(FilesPath + fileName);
        }
    }
}