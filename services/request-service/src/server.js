require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3004;

const server = app.listen(PORT, () => {
    console.log(`Request Service running on port ${PORT}`);
});

const shutdown = () => {
    server.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
