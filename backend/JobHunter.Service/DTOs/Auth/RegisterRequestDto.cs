namespace JobHunter.Service.DTOs.Auth
{
    public class RegisterRequestDto
    {
        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Name { get; set; } = null!;

        public string Phone { get; set; } = null!;
    }
}

