using Microsoft.AspNetCore.Http;

namespace JobHunter.Service.Utils;

public static class SetTokenCookies
{
    public static void SetTokenCookiesToResponse(HttpResponse response, string accessToken, string refreshToken)
    {
        var isHttps = response.HttpContext.Request.IsHttps;
        var sameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax;

        var accessTokenOption = new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = sameSite,
            Path = "/",
            Expires = DateTime.UtcNow.AddMinutes(15)
        };

        var refreshTokenOption = new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            SameSite = sameSite,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(7)
        };

        response.Cookies.Append("access_token", accessToken, accessTokenOption);
        response.Cookies.Append("refresh_token", refreshToken, refreshTokenOption);
    }
}