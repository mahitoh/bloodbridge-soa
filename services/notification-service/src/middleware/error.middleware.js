const { errorResponse } = require('../utils/apiResponse');

const notFoundMiddleware = (req, res) => {
    return errorResponse(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

const errorMiddleware = (err, req, res, next) => {
    return errorResponse(res, err.status || 500, err.message || 'Internal server error');
};

module.exports = { errorMiddleware, notFoundMiddleware };
