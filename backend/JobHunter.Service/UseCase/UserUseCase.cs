using JobHunter.Domain;
using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs.Auth;
using JobHunter.Service.DTOs.User;
using JobHunter.Service.Interface.Persistence;
using JobHunter.Service.Interface.UseCase;
using JobHunter.Service.Utils;

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

        return MapToCurrentUserDto(user);
    }

    public async Task Register(RegisterRequestDto request)
    {
        var existingUser = await _userRepository.GetUserByEmail(request.Email);
        if (existingUser != null)
        {
            throw new InvalidOperationException("Email đã được sử dụng");
        }

        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Password = PasswordHashing.HashPassword(request.Password),
            Role = UserRole.Candidate
        };

        await _userRepository.AddUser(newUser);
    }

    public async Task<CurrentUserDto> UpdateUser(Guid userId, UpdateUserRequestDto request)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        if (request.Name != null)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                throw new ArgumentException("Name cannot be empty");
            }

            user.Name = request.Name;
        }

        if (request.Phone != null)
        {
            user.Phone = request.Phone;
        }

        if (request.Password != null)
        {
            if (string.IsNullOrWhiteSpace(request.Password))
            {
                throw new ArgumentException("Password cannot be empty");
            }

            user.Password = PasswordHashing.HashPassword(request.Password);
        }

        if (request.Avatar != null)
        {
            user.Avatar = request.Avatar;
        }

        if (request.Role.HasValue)
        {
            user.Role = request.Role.Value;
        }

        await _userRepository.UpdateUser(user);

        return MapToCurrentUserDto(user);
    }

    private static CurrentUserDto MapToCurrentUserDto(User user)
    {
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
