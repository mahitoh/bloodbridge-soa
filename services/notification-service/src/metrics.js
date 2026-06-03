const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status', 'service'],
  registers: [register]
});

const responseTime = new client.Histogram({
  name: 'http_response_time_seconds',
  help: 'Response time in seconds',
  labelNames: ['method', 'route', 'service'],
  buckets: [0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register]
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['service'],
  registers: [register]
});

const notificationsSent = new client.Counter({
  name: 'bloodbridge_notifications_sent_total',
  help: 'Total notifications sent',
  labelNames: ['type', 'service'],
  registers: [register]
});

module.exports = {
  register,
  httpRequests,
  responseTime,
  activeConnections,
  notificationsSent
};
