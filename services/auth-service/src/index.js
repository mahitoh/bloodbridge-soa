const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'auth-service' });
});

const PORT = process.env.PORT || 3001;
module.exports = app;
