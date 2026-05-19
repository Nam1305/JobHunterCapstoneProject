using System.Net;
using System.Text.Json;
using JobHunter.Service.DTOs;

namespace JobHunter.WebAPI.Middlewares
{
    public sealed class ExceptionMiddleware : IMiddleware
    {
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(ILogger<ExceptionMiddleware> logger)
        {
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                if (context.Response.HasStarted)
                {
                    throw;
                }

                var (statusCode, message, errorCode) = MapException(ex);
                context.Response.Clear();
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = statusCode;

                var response = new ResponseBase<object?>
                {
                    Success = false,
                    Status = statusCode,
                    Message = message,
                    ErrorCode = errorCode,
                    Data = null
                };

                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        }

        private static (int StatusCode, string Message, string ErrorCode) MapException(Exception ex)
        {
            return ex switch
            {
                KeyNotFoundException => ((int)HttpStatusCode.NotFound, ex.Message, "NOT_FOUND"),
                ArgumentException => ((int)HttpStatusCode.BadRequest, ex.Message, "BAD_REQUEST"),
                UnauthorizedAccessException => ((int)HttpStatusCode.Unauthorized, ex.Message, "UNAUTHORIZED"),
                _ => ((int)HttpStatusCode.InternalServerError, "An unexpected error occurred.", "INTERNAL_ERROR")
            };
        }
    }
}
