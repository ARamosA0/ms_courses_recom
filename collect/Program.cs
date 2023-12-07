using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using StackExchange.Redis;
using System;

namespace MiProyecto
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                var redisConn = OpenRedisConnection("172.23.0.3"); // Reemplazar con la dirección IP de Redis
                var redis = redisConn.GetDatabase();

                if (redisConn != null && redisConn.IsConnected)
                {
                    Console.WriteLine("Conexión con Redis establecida correctamente.");
                    Console.WriteLine("API funcionando");

                    CreateWebHostBuilder(args, redis).Build().Run();
                }
                else
                {
                    Console.WriteLine("No se pudo conectar a Redis.");
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.ToString());
            }
        }

        private static ConnectionMultiplexer OpenRedisConnection(string ipAddress)
        {
            while (true)
            {
                try
                {
                    Console.Error.WriteLine("Connecting to redis");
                    return ConnectionMultiplexer.Connect(ipAddress);
                }
                catch (RedisConnectionException)
                {
                    Console.Error.WriteLine("Waiting for redis");
                    System.Threading.Thread.Sleep(1000);
                }
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args, IDatabase redis)
        {
            return new WebHostBuilder()
                .UseKestrel()
                .Configure(app =>
                {
                    app.UseRouting();

                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapGet("/", async context =>
                        {
                            await context.Response.WriteAsync("{\"message\":\"API funcionando\"}");
                        });

                        endpoints.MapPost("/process", async context =>
                        {
                            // Lógica para manejar la solicitud POST en la ruta /process
                            // Por ejemplo, obtener datos del cuerpo de la solicitud y procesarlos
                            // Ejemplo de respuesta con un mensaje JSON
                            await context.Response.WriteAsync("{\"message\":\"Datos procesados correctamente\"}");
                        });
                    });
                })
                .UseUrls("http://*:5003");
        }
    }
}
