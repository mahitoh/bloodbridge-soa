require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3003;

async function initDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hospitals (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(50),
                city VARCHAR(100),
                address TEXT,
                latitude DECIMAL(9,6),
                longitude DECIMAL(9,6),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Database tables initialized for hospital-service');
    } catch (err) {
        console.error('❌ Failed to initialize database:', err);
        process.exit(1);
    }
}

initDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`🚀 Hospital Service running on port ${PORT}`);
    });

    const shutdown = async () => {
        server.close(async () => {
            await pool.end();
            process.exit(0);
        });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}).catch(err => {
    console.error('Failed to start service:', err);
    process.exit(1);
});
