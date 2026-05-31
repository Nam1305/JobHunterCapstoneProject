using JobHunter.Domain;
using JobHunter.Domain.Entities;
using JobHunter.Service.DTOs;
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

    public async Task<PageResult<UserInfoDto>> GetUsers(string? search, int page, int pageSize)
    {
        if (page < 1)
        {
            throw new ArgumentException("Page must be greater than 0");
        }

        if (pageSize < 1)
        {
            throw new ArgumentException("Page size must be greater than 0");
        }

        var users = await _userRepository.GetUsers(search, page, pageSize);
        var totalCount = await _userRepository.CountUsers(search);

        return new PageResult<UserInfoDto>
        {
            Items = users.Select(user => new UserInfoDto
            {
                Id = user.Id,
                Name = user.Name,
                Phone = user.Phone,
                Email = user.Email,
                Avatar = user.Avatar,
                Role = user.Role,
                IsDeleted = user.IsDelete
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };
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

        //if password is not null or empty, update password
        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            user.Password = PasswordHashing.HashPassword(request.Password);
        }

        await _userRepository.UpdateUser(user);

        return new CurrentUserDto
        {
            Id = user.Id,
            Name = user.Name,
            Phone = user.Phone,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task DeleteUser(Guid userId)
    {
        var isDeleted = await _userRepository.DeleteUser(userId);
        if (!isDeleted)
        {
            throw new KeyNotFoundException("User not found");
        }
    }

    public async Task<CurrentUserDto> CreateUser(CreateUserDto request)
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
            Password = string.IsNullOrWhiteSpace(request.Password) ? null : PasswordHashing.HashPassword(request.Password),
            Role = request.Role ?? UserRole.Candidate
        };

        await _userRepository.AddUser(newUser);

        return new CurrentUserDto
        {
            Id = newUser.Id,
            Name = newUser.Name,
            Phone = newUser.Phone,
            Email = newUser.Email,
            Avatar = newUser.Avatar,
            Role = newUser.Role
        };
    }

    public async Task UpdateAvatar(Guid userId, string avatarUrl)
    {
        var user = await _userRepository.GetUserById(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("User not found");
        }

        user.Avatar = avatarUrl;
        await _userRepository.UpdateUser(user);
    }
}
