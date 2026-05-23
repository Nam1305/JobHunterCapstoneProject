using JobHunter.Domain;

namespace JobHunter.Service.DTOs.User
{
    public class UserInfoDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Phone { get; set; }

        public string Email { get; set; } = null!;

        public string? Avatar { get; set; }

        public UserRole? Role { get; set; } = null!;

        public bool IsDeleted { get; set; }
    }
}
