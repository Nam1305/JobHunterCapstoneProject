using JobHunter.Service.Constant;

namespace JobHunter.Service.DTOs.Auth
{
    public class CurrentUserDto
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = null!;

        public string? Phone { get; set; }

        public string Email { get; set; } = null!;

        public string? Avatar { get; set; }

        public UserRoleEnum? Role { get; set; } = null!;
    }
}
