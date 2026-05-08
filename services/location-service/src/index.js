const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'location-service' });
});

const PORT = process.env.PORT || 3000;
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`location-service running on port ${PORT}`));
}
module.exports = app;
