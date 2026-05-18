using JobHunter.Service.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers
{
    [Route("api/[controller]")]
    public class DummyController : BaseController
    {
        [HttpGet]
        [ProducesResponseType(typeof(ResponseBase<DummyResponse>), StatusCodes.Status200OK)]
        public IActionResult Get()
        {
            var response = new ResponseBase<DummyResponse>(
                new DummyResponse
                {
                    Message = "JobHunter dummy API is running.",
                    ServerTimeUtc = DateTime.UtcNow
                });

            return Ok(response);
        }
    }

    public class DummyResponse
    {
        public string Message { get; set; } = string.Empty;

        public DateTime ServerTimeUtc { get; set; }
    }
}
