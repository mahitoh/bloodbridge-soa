const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth.routes');
const swaggerDocument = require('./docs/swagger');
const { errorMiddleware, notFoundMiddleware } = require('./middleware/error.middleware');
const metrics = require('./metrics');

const app = express();

app.use((req, res, next) => {
    const start = Date.now();
    metrics.activeConnections.inc({ service: 'auth-service' });
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        metrics.httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode, service: 'auth-service' });
        metrics.responseTime.observe({ method: req.method, route: req.path, service: 'auth-service' }, duration);
        metrics.activeConnections.dec({ service: 'auth-service' });
    });
    next();
});

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'auth-service' });
});

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metrics.register.contentType);
    res.end(await metrics.register.metrics());
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', authRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
