using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using JobHunter.Service.DTOs.Company;
using JobHunter.Service.Interface.Service;

namespace JobHunter.Service.Service;

public class VietQrBusinessService : IVietQrBusinessService
{
    private readonly HttpClient _httpClient;

    public VietQrBusinessService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<CompanyTaxCodeInfoDto> GetBusinessByTaxCode(string taxCode)
    {
        if (string.IsNullOrWhiteSpace(taxCode))
        {
            throw new ArgumentException("Tax code is required");
        }

        using var response = await _httpClient.GetAsync($"v2/business/{Uri.EscapeDataString(taxCode.Trim())}");
        if (response.StatusCode == HttpStatusCode.TooManyRequests)
        {
            throw new HttpRequestException(
                "VietQR rate limit exceeded. Please try again later.",
                null,
                HttpStatusCode.TooManyRequests);
        }

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            throw new KeyNotFoundException("Tax code not found");
        }

        response.EnsureSuccessStatusCode();

        var vietQrResponse = await response.Content.ReadFromJsonAsync<VietQrBusinessResponse>();
        if (vietQrResponse?.Data == null)
        {
            throw new KeyNotFoundException("Tax code not found");
        }

        return new CompanyTaxCodeInfoDto
        {
            Name = vietQrResponse.Data.Name,
            InternationalName = vietQrResponse.Data.InternationalName,
            ShortName = vietQrResponse.Data.ShortName,
            Address = vietQrResponse.Data.Address,
            Status = vietQrResponse.Data.Status
        };
    }

    private class VietQrBusinessResponse
    {
        public VietQrBusinessData? Data { get; set; }
    }

    private class VietQrBusinessData
    {
        public string? Name { get; set; }

        public string? InternationalName { get; set; }

        public string? ShortName { get; set; }

        public string? Address { get; set; }

        public string? Status { get; set; }
    }
}
