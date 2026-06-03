const { z } = require('zod');
const { errorResponse } = require('../utils/apiResponse');

const smsNotificationSchema = z.object({
    phone: z.string().min(5, 'Phone number must be at least 5 characters'),
    message: z.string().min(1, 'Message is required')
});

const emailNotificationSchema = z.object({
    email: z.string().email('Valid email is required'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required')
});

const donorNotificationSchema = smsNotificationSchema.extend({
    donorId: z.string().min(1, 'Donor ID is required')
});

const hospitalNotificationSchema = emailNotificationSchema.extend({
    hospitalId: z.string().min(1, 'Hospital ID is required')
});

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return errorResponse(res, 400, 'Validation failed', result.error.flatten().fieldErrors);
    }

    req.body = result.data;
    next();
};

module.exports = {
    validateSmsNotification: validate(smsNotificationSchema),
    validateEmailNotification: validate(emailNotificationSchema),
    validateDonorNotification: validate(donorNotificationSchema),
    validateHospitalNotification: validate(hospitalNotificationSchema)
};
