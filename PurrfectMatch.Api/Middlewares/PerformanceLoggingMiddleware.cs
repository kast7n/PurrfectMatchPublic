using Serilog;
using System.Diagnostics;

public class PerformanceLoggingMiddleware
{
    private readonly RequestDelegate _next;

    public PerformanceLoggingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        await _next(context);

        stopwatch.Stop();

        if (stopwatch.ElapsedMilliseconds > 500) // Log only if execution time exceeds 500ms
        {
            Log.Warning("Long-running request: {Method} {Path} took {ElapsedMilliseconds}ms", 
                context.Request.Method, context.Request.Path, stopwatch.ElapsedMilliseconds);
        }
        else
        {
            Log.Information("Request: {Method} {Path} completed in {ElapsedMilliseconds}ms", 
                context.Request.Method, context.Request.Path, stopwatch.ElapsedMilliseconds);
        }
    }
}