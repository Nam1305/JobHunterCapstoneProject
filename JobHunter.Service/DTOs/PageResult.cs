using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace JobHunter.Service.DTOs
{
    public class PageResult<T>
    {

        [JsonPropertyName("items")]
        public List<T> Items { get; set; }

        [JsonPropertyName("page")]
        public int Page { get; set; }

        [JsonPropertyName("pageSize")]
        public int PageSize { get; set; }

        [JsonPropertyName("totalCount")]
        public int TotalCount { get; set; }

        [JsonPropertyName("totalPage")]
        public int TotalPage => PageSize == 0 ? 0 : (TotalCount + PageSize - 1) / PageSize;
    }
}
