using System.Security.Claims;

namespace JobHunter.Service.Utils;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (value == null || !Guid.TryParse(value, out var userId))
        {
            throw new UnauthorizedAccessException("Token không hợp lệ hoặc hết hạn");
        }

        return userId;
    }
}