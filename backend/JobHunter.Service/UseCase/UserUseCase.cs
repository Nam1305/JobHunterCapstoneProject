using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;

namespace JobHunter.Service.UseCase;

public class UserUseCase : IUserUseCase
{
    private readonly IUserRepository _userRepository;

    public UserUseCase(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<CurrentUserDto> GetCurrentUser(Guid userId)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("Không tìm thấy thông tin tài khoản");
        }

        return new CurrentUserDto
        {
            Id = user.Id,
            Name = user.Name,
            Phone = user.Phone,
            Email = user.Email,
            Avatar = user.Avatar,
            Role = user.Role
        };
    }
}
