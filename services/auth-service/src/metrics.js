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

const totalUsers = new client.Gauge({
  name: 'bloodbridge_total_users',
  help: 'Total registered users',
  registers: [register]
});

const usersByRole = new client.Gauge({
  name: 'bloodbridge_users_by_role',
  help: 'Users grouped by role',
  labelNames: ['role'],
  registers: [register]
});

const updateUserMetrics = (users) => {
  totalUsers.set(users.length);
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
  Object.entries(roleCounts).forEach(([role, count]) => {
    usersByRole.set({ role }, count);
  });
};

module.exports = {
  register,
  httpRequests,
  responseTime,
  activeConnections,
  totalUsers,
  usersByRole,
  updateUserMetrics
};
