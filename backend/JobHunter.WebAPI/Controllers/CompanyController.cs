using JobHunter.Service.DTOs;
using JobHunter.Service.DTOs.Company;
using JobHunter.Service.Interface.UseCase;
using Microsoft.AspNetCore.Mvc;

namespace JobHunter.WebAPI.Controllers;

[Route("api/companies")]
[ApiController]
public class CompanyController : ControllerBase
{
    private readonly ICompanyUseCase _companyUseCase;

    public CompanyController(ICompanyUseCase companyUseCase)
    {
        _companyUseCase = companyUseCase;
    }

    [HttpGet("top")]
    public async Task<ActionResult<ResponseBase<List<CompanyCardDto>>>> GetTopCompanies(
        [FromQuery] int limit = 10)
    {
        var companies = await _companyUseCase.GetTopCompanies(limit);
        return new ResponseBase<List<CompanyCardDto>>(companies);
    }

    [HttpGet]
    public async Task<ActionResult<ResponseBase<PageResult<CompanyCardDto>>>> GetCompanies(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 9)
    {
        var result = await _companyUseCase.GetCompanies(search, page, pageSize);
        return new ResponseBase<PageResult<CompanyCardDto>>(result);
    }

    [HttpGet("~/api/companies/{slug}")]
    public async Task<ActionResult<ResponseBase<CompanyDetailsDto>>> GetCompanyBySlug(string slug)
    {
        var company = await _companyUseCase.GetCompanyBySlug(slug);
        return new ResponseBase<CompanyDetailsDto>(company);
    }
}
