require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');
const redis = require('./config/redis');

const PORT = process.env.PORT || 3002;

async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS donors (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                blood_type VARCHAR(5) NOT NULL,
                phone VARCHAR(50),
                city VARCHAR(100),
                latitude DECIMAL(9,6),
                longitude DECIMAL(9,6),
                email VARCHAR(255) UNIQUE,
                available BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Database tables initialized for donor-service');
        
        // Test Redis connection
        await redis.ping();
        console.log('✅ Redis connected successfully');
    } catch (err) {
        console.error('❌ Failed to initialize database or Redis:', err);
        process.exit(1);
    }
}

initDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Donor Service running on port ${PORT}`);
    });

    const shutdown = async () => {
        server.close(async () => {
            await pool.end();
            await redis.quit();
            process.exit(0);
        });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}).catch(err => {
    console.error('Failed to start service:', err);
    process.exit(1);
});
