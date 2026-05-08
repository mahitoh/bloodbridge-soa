const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'auth-service' });
});

const PORT = process.env.PORT || 3001;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
}
module.exports = app;
