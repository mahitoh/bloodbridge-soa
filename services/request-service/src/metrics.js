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

const totalRequests = new client.Gauge({
  name: 'bloodbridge_blood_requests_total',
  help: 'Total blood requests',
  registers: [register]
});

const activeRequests = new client.Gauge({
  name: 'bloodbridge_blood_requests_active',
  help: 'Active blood requests',
  registers: [register]
});

const requestsByBloodType = new client.Gauge({
  name: 'bloodbridge_requests_by_blood_type',
  help: 'Blood requests grouped by blood type',
  labelNames: ['blood_type'],
  registers: [register]
});

const updateRequestMetrics = (bloodRequests) => {
  totalRequests.set(bloodRequests.length);
  activeRequests.set(bloodRequests.filter((request) => request.status === 'Active').length);

  const bloodTypeCounts = bloodRequests.reduce((acc, request) => {
    acc[request.blood_type] = (acc[request.blood_type] || 0) + 1;
    return acc;
  }, {});

  Object.entries(bloodTypeCounts).forEach(([bloodType, count]) => {
    requestsByBloodType.set({ blood_type: bloodType }, count);
  });
};

module.exports = {
  register,
  httpRequests,
  responseTime,
  activeConnections,
  totalRequests,
  activeRequests,
  requestsByBloodType,
  updateRequestMetrics
};
