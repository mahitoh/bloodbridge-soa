const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'donor-service' });
});

const PORT = process.env.PORT || 3000;
module.exports = app;
