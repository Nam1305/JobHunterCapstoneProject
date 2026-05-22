using JobHunter.Domain;

namespace JobHunter.Service.DTOs.User;

public class UpdateUserRequestDto
{
    public string? Name { get; set; }

    public string? Phone { get; set; }

    public string? Password { get; set; }

    public string? Avatar { get; set; }

    public UserRole? Role { get; set; }
}
