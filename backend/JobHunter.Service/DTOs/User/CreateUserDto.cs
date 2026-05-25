using JobHunter.Domain;
using JobHunter.Service.DTOs.User;

public class CreateUserDto : UpdateUserRequestDto
{
    public UserRole? Role { get; set; }

    public string Email { get; set; } = null!;
}