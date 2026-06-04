require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const { connectRabbitMQ, getChannel } = require('./config/rabbitmq');

const PORT = process.env.PORT || 3006;

async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                type VARCHAR(20) NOT NULL,
                recipient VARCHAR(255) NOT NULL,
                subject VARCHAR(255),
                message TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'pending',
                provider_response JSONB,
                metadata JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Database tables initialized for notification-service');
    } catch (err) {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1);
    }
}

function startConsumer() {
    connectRabbitMQ()
        .then(channel => {
            if (!channel) {
                console.log('⚠️  RabbitMQ channel not available. Queue consumer not started.');
                return;
            }
            console.log('📥 Starting to consume messages from blood_requests queue...');
            channel.consume('blood_requests', async (msg) => {
                if (msg !== null) {
                    try {
                        const data = JSON.parse(msg.content.toString());
                        console.log(`📩 Received request notification: ${data.bloodType}, Urgency: ${data.urgency}`);

                        await pool.query(
                            `INSERT INTO notifications (type, recipient, message, status, metadata)
                             VALUES ($1, $2, $3, $4, $5)`,
                            ['system', 'queue-processor', `Processed request ${data.requestId}`, 'sent', JSON.stringify(data)]
                        );

                        channel.ack(msg);
                    } catch (err) {
                        console.error('❌ Error processing message:', err);
                        channel.nack(msg, false, true);
                    }
                }
            }, { noAck: false });
        })
        .catch(err => {
            console.error('⚠️  RabbitMQ connection failed. Queue processing disabled. Service will still respond to HTTP requests.', err.message);
        });
}

initDB().then(() => {
    startConsumer();

    const server = app.listen(PORT, () => {
        console.log(`🚀 Notification Service running on port ${PORT}`);
    });

    const shutdown = async () => {
        server.close(async () => {
            await pool.end();
            const channel = getChannel();
            if (channel) await channel.close();
            process.exit(0);
        });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}).catch(err => {
    console.error('Failed to start service:', err);
    process.exit(1);
});
