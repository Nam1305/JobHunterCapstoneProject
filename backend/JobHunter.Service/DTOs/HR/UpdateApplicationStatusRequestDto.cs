using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs.HR;

public class UpdateApplicationStatusRequestDto
{
    [JsonPropertyName("status")]
    [Required]
    public string Status { get; set; } = null!;
}
