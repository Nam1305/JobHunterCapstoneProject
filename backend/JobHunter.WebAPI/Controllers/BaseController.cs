using JobHunter.Service.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        [NonAction]
        protected IActionResult Fail(
            int statusCode,
            string message,
            string? errorCode = null,
            IEnumerable<string>? errors = null)
        {
            var errorResponse = new ResponseBase<object?>
            {
                Success = false,
                Status = statusCode,
                Message = message,
                ErrorCode = errorCode ?? "ERROR",
                Errors = errors?.ToList() ?? [],
                Data = null
            };

            return StatusCode(statusCode, errorResponse);
        }
    }
}
