import amqp from 'amqplib';

async function sendToQueue(queueName, data) {
  const connection = await amqp.connect(process.env.RabbitMQ_URL);
  const channel = await connection.createChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
  await channel.close();
  await connection.close();
}
export { sendToQueue };
