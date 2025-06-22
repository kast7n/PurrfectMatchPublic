using Serilog;
using System.Diagnostics;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public class DependencyLoggingHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();

        Serilog.Log.Information("Sending request to {Url} with method {Method}", request.RequestUri, request.Method);

        var response = await base.SendAsync(request, cancellationToken);

        stopwatch.Stop();

        Serilog.Log.Information("Received response from {Url} with status code {StatusCode} in {ElapsedMilliseconds}ms", 
            request.RequestUri, response.StatusCode, stopwatch.ElapsedMilliseconds);

        return response;
    }
}