using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;
using JobHunter.Service.Interface.UseCase;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/admin")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminCompanyUseCase _adminCompanyUseCase;

    public AdminController(IAdminCompanyUseCase adminCompanyUseCase)
    {
        _adminCompanyUseCase = adminCompanyUseCase;
    }

    [HttpGet("company-registrations")]
    public async Task<ActionResult<ResponseBase<CompanyRegistrationPageDto>>> GetCompanyRegistrations(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? status = null)
    {
        var result = await _adminCompanyUseCase.GetCompanyRegistrations(page, limit, status);
        return new ResponseBase<CompanyRegistrationPageDto>(result);
    }
}
