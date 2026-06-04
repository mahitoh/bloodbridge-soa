require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const { connectRabbitMQ } = require('./config/rabbitmq');

const PORT = process.env.PORT || 3004;

async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS requests (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                hospital_id UUID NOT NULL,
                blood_type VARCHAR(5) NOT NULL,
                units INTEGER NOT NULL,
                urgency VARCHAR(20) NOT NULL,
                radius INTEGER DEFAULT 20,
                notes TEXT,
                status VARCHAR(20) DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Database tables initialized for request-service');
        
        // Connect to RabbitMQ
        await connectRabbitMQ();
    } catch (err) {
        console.error('❌ Failed to initialize database or RabbitMQ:', err);
        process.exit(1);
    }
}

initDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Request Service running on port ${PORT}`);
    });

    const shutdown = async () => {
        server.close(async () => {
            await pool.end();
            // Note: amqplib connection close is handled by the process exit or can be added here
            process.exit(0);
        });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}).catch(err => {
    console.error('Failed to start service:', err);
    process.exit(1);
});
