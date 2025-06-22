using Serilog;
using System.Diagnostics;

public class RequestResponseLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public RequestResponseLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        // Log Request
        Log.Information("Incoming Request: {Method} {Path}", context.Request.Method, context.Request.Path);

        await _next(context);

        stopwatch.Stop();

        // Log Response
        Log.Information("Outgoing Response: {StatusCode} {ElapsedMilliseconds}ms", context.Response.StatusCode, stopwatch.ElapsedMilliseconds);
    }
}