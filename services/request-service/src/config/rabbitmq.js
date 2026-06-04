const amqp = require('amqplib');

let channel = null;
let connection = null;

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        
        // Assert the queue exists
        await channel.assertQueue('blood_requests', { durable: true });
        console.log('✅ RabbitMQ connected and queue asserted');
        
        connection.on('error', (err) => {
            console.error('RabbitMQ connection error:', err);
            setTimeout(connectRabbitMQ, 5000);
        });
        
        return channel;
    } catch (err) {
        console.error('❌ Failed to connect to RabbitMQ:', err);
        throw err;
    }
}

module.exports = { connectRabbitMQ, getChannel: () => channel };
