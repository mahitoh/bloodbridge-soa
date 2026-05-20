require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
    console.log(`Donor Service running on port ${PORT}`);
});

const shutdown = () => {
    server.close(() => process.exit(0));
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
