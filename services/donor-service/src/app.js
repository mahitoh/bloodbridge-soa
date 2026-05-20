const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const donorRoutes = require('./routes/donor.routes');
const swaggerDocument = require('./docs/swagger');
const { errorMiddleware, notFoundMiddleware } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'donor-service' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/donors', donorRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
