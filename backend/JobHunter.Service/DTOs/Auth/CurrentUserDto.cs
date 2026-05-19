using JobHunter.Domain;
namespace JobHunter.Service.DTOs.Auth
{
    public class CurrentUserDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Phone { get; set; }

        public string Email { get; set; } = null!;

        public string? Avatar { get; set; }

        public UserRole? Role { get; set; } = null!;
    }
}
