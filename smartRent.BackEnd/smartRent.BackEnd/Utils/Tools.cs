using System.IO;

namespace smartRent.BackEnd.Utils
{
    public static class Tools
    {

        private static readonly string FilePath = Directory.GetCurrentDirectory() + "/data/";
        
        public static byte[] ReadFully(Stream input)
        {
            using var ms = new MemoryStream();
            input.CopyTo(ms);
            return ms.ToArray();
        }
    }
}