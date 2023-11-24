
using System;
using Confluent.Kafka;
using System.Threading;

class Program
{
    static void Main(string[] args)
    {
        var config = new ProducerConfig
        {
            BootstrapServers = "your_kafka_brokers"
        };

        // Producer
        using (var producer = new ProducerBuilder<Null, string>(config).Build())
        {
            var message = "Hello, Kafka!";
            producer.Produce("your_topic", new Message<Null, string> { Value = message }, deliveryReport =>
            {
                Console.WriteLine(deliveryReport.Status == PersistenceStatus.Persisted
                    ? $"Message delivered to {deliveryReport.TopicPartitionOffset}"
                    : $"Delivery failed: {deliveryReport.Error.Reason}");
            });
            producer.Flush(TimeSpan.FromSeconds(10));
        }

        // Consumer
        var consumerConfig = new ConsumerConfig
        {
            BootstrapServers = "your_kafka_brokers",
            GroupId = "test-consumer-group",
            AutoOffsetReset = AutoOffsetReset.Earliest
        };

        using (var consumer = new ConsumerBuilder<Ignore, string>(consumerConfig).Build())
        {
            consumer.Subscribe("your_topic");

            CancellationTokenSource cts = new CancellationTokenSource();
            Console.CancelKeyPress += (_, e) => {
                e.Cancel = true;
                cts.Cancel();
            };

            try
            {
                while (true)
                {
                    try
                    {
                        var message = consumer.Consume(cts.Token);
                        Console.WriteLine($"Consumed message: {message.Value}");
                    }
                    catch (ConsumeException e)
                    {
                        Console.WriteLine($"Error occurred: {e.Error.Reason}");
                    }
                }
            }
            catch (OperationCanceledException)
            {
                consumer.Close();
            }
        }
    }
}

// var builder = WebApplication.CreateBuilder(args);
//
// // Add services to the container.
//
// builder.Services.AddControllers();
// // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();
//
// var app = builder.Build();
//
// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }
//
// app.UseHttpsRedirection();
//
// app.UseAuthorization();
//
// app.MapControllers();
//
// app.Run();
