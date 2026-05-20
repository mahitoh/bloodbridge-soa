const notFoundMiddleware = (req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
};

module.exports = { errorMiddleware, notFoundMiddleware };
