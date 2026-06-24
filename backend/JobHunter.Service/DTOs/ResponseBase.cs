using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs
{
    public class ResponseBase<T>
    {
        public ResponseBase()
        {
            Success = false;
            Status = 0;
            Message = "Exist an error.";
        }


        public ResponseBase(T data)
        {
            Success = true;
            Status = 200;
            Message = "Thành công.";
            Data = data;
        }

        public ResponseBase(string message)
        {
            Success = true;
            Status = 200;
            Message = message;
            Data = default(T);
        }

        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }

        [JsonPropertyName("errorCode")]
        public string? ErrorCode { get; set; }

        [JsonPropertyName("data")]
        public T? Data { get; set; }
    }
}
