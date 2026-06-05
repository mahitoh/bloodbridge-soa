const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const donorRoutes = require('./routes/donor.routes');
const swaggerDocument = require('./docs/swagger');
const { errorMiddleware, notFoundMiddleware } = require('./middleware/error.middleware');
const metrics = require('./metrics');

const app = express();
const SERVICE_NAME = 'donor-service';

app.use((req, res, next) => {
  const start = Date.now();
  metrics.activeConnections.inc({ service: SERVICE_NAME });
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    metrics.httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode, service: SERVICE_NAME });
    metrics.responseTime.observe({ method: req.method, route: req.path, service: SERVICE_NAME }, duration);
    metrics.activeConnections.dec({ service: SERVICE_NAME });
  });
  next();
});

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'https://mahitoh.github.io', 'http://64.225.100.80:30000'],
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: SERVICE_NAME });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/donors', donorRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
