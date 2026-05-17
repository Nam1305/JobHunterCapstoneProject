using JobHunter.Service.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers
{
    [ApiController]
    public class BaseController : Controller
    {
        public BaseController()
        {
        }
        [NonAction]
        public IActionResult HandleException(Exception ex)
        {
            var errorResponse = new ResponseBase<string>
            {
                Success = false,
                Message = "An unexpected error occurred.",
                Status = 500,
                Data = null
            };
            return StatusCode(errorResponse.Status, errorResponse);

        }
    }
}
