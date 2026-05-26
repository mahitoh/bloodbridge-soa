const successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const errorResponse = (res, statusCode, message, details = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        details
    });
};

module.exports = { successResponse, errorResponse };