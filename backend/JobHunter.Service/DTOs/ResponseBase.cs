using System;
using System.Collections.Generic;
using System.Text;
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


        public ResponseBase(T Data)
        {
            Success = true;
            Status = 200;
            Message = "Success.";
            Data = Data;
        }

        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }

        [JsonPropertyName("errorCode")]
        public string ErrorCode { get; set; }

        [JsonPropertyName("errors")]
        public List<string> Errors { get; set; }

        [JsonPropertyName("data")]
        public T Data { get; set; }
    }
}
