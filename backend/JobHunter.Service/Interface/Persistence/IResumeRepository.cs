using JobHunter.Domain.Entities;

namespace JobHunter.Service.Interface.Persistence;

public interface IResumeRepository
{
    Task<List<Resume>> GetResumesByUserId(Guid userId);
    Task<Resume?> GetResumeById(Guid resumeId);
    Task<Resume> AddResume(Resume resume);
    Task UpdateResume(Resume resume);
    Task DeleteResume(Resume resume);
}
