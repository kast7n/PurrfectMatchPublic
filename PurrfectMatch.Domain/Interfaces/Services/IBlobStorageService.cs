namespace PurrfectMatch.Domain.Interfaces.Services
{
    public interface IBlobStorageService
    {
        Task<string> UploadImageAsync(string fileName, Stream fileStream);
        Task<Stream> GetImageAsync(string fileName);
        Task DeleteImageAsync(string fileName);
    }
}