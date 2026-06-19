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
    public async Task<ActionResult<ResponseBase<PageResult<CompanyRegistrationDto>>>> GetCompanyRegistrations(
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? status = null)
    {
        var result = await _adminCompanyUseCase.GetCompanyRegistrations(page, limit, status);
        return new ResponseBase<PageResult<CompanyRegistrationDto>>(result);
    }

    [HttpGet("company-registrations/{uid:guid}")]
    public async Task<ActionResult<ResponseBase<CompanyRegistrationDetailDto>>> GetCompanyRegistration(Guid uid)
    {
        var result = await _adminCompanyUseCase.GetCompanyRegistration(uid);
        return new ResponseBase<CompanyRegistrationDetailDto>(result);
    }

    [HttpPatch("company-registrations/{uid:guid}/approve")]
    public async Task<ActionResult<ResponseBase<object?>>> ApproveCompanyRegistration(Guid uid)
    {
        await _adminCompanyUseCase.ApproveCompanyRegistration(uid);
        return new ResponseBase<object?>(null);
    }

    [HttpGet("check-tax-code")]
    public async Task<ActionResult<ResponseBase<CompanyTaxCodeInfoDto>>> CheckTaxCode([FromQuery] string taxCode)
    {
        var result = await _adminCompanyUseCase.CheckTaxCode(taxCode);
        return new ResponseBase<CompanyTaxCodeInfoDto>(result);
    }
}
