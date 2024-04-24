import amqp from 'amqplib/callback_api';
import { createBookingSpa, createOrder, createBookingHome } from '../services';

const handleConsumerMessage = async (channel, msg, serviceFunction) => {
  if (msg !== null) {
    try {
      const data = JSON.parse(msg.content.toString());
      const response = await serviceFunction(data);
      //console.log(response);
      channel.ack(msg);
      return response;
    } catch (err) {
      console.error('Error processing message:', err);
      channel.nack(msg);
      return err;
    }
  }
};

const startConsumer = () => {
  // new Promise((resolve, reject) => {
  // Kết nối đến RabbitMQ server
  amqp.connect(process.env.RabbitMQ_URL, (err, connection) => {
    if (err) {
      console.error('Error connecting to RabbitMQ:', err);
      return;
    }

    // Tạo một channel
    connection.createChannel((err, channel) => {
      if (err) {
        console.error('Error creating channel:', err);
        return;
      }

      // Tạo các queue (nếu chưa tồn tại)
      const queues = ['booking_spa_queue', 'booking_home_queue', 'order_queue'];
      queues.forEach((queue) => {
        channel.assertQueue(queue, { durable: true });
        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

        // Tiêu thụ các message từ queue
        channel.consume(
          queue,
          async (msg) => {
            let serviceFunction;
            switch (queue) {
              case 'booking_spa_queue':
                serviceFunction = createBookingSpa;
                break;
              case 'booking_home_queue':
                serviceFunction = createBookingHome;
                break;
              case 'order_queue':
                serviceFunction = createOrder;
                break;
              default:
                console.error(`Unknown queue: ${queue}`);
                channel.nack(msg);
                return;
            }
            return handleConsumerMessage(channel, msg, serviceFunction);

            // try {
            //   const response = await handleConsumerMessage(
            //     channel,
            //     msg,
            //     serviceFunction,
            //   );
            //   // console.log(response);
            //   resolve(response);
            //   // connection.close();
            //   // Trả về kết quả của createBooking
            // } catch (err) {
            //   throw err; // Trả về lỗi để xử lý ở bên ngoài
            // }
          },
          { noAck: true },
        );
      });
    });
  });
};

export { startConsumer };
