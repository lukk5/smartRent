using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using smartRent.Repo.RepoInterfaces;

namespace smartRent.Repo.Repo
{
    public class FileRepository: IFileRepository
    {
        private static readonly string FilesPath = Directory.GetCurrentDirectory() + "/data/";
        
        public byte[] GetFileContentByName(string fileName)
        {
            return File.ReadAllBytes(FilesPath + fileName);
        }

        public async Task WriteFile(IFormFile file, string fileName)
        {
            var path = FilesPath + fileName;
            await using var stream = new FileStream(path, FileMode.Create);
            await file.CopyToAsync(stream);
        }

        public async Task WriteFile(byte[] file, string fileName)
        {
            var path = FilesPath + fileName;
            await using var stream = new FileStream(path, FileMode.Create);
            await stream.WriteAsync(file);
        }

        public void RemoveFileByName(string fileName)
        {
            try
            {
                File.Delete(FilesPath + fileName);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
   
            }
        }
    }
}