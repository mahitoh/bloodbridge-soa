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

const totalDonors = new client.Gauge({
  name: 'bloodbridge_total_donors',
  help: 'Total registered donors',
  registers: [register]
});

const availableDonors = new client.Gauge({
  name: 'bloodbridge_available_donors',
  help: 'Currently available donors',
  registers: [register]
});

const updateDonorMetrics = (donors) => {
  totalDonors.set(donors.length);
  availableDonors.set(donors.filter(d => d.available).length);
};

module.exports = {
  register,
  httpRequests,
  responseTime,
  activeConnections,
  totalDonors,
  availableDonors,
  updateDonorMetrics
};
