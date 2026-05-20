const { z } = require('zod');

const donorNotificationSchema = z.object({
    donorId: z.string().min(1),
    phone: z.string().min(5),
    message: z.string().min(1)
});

const hospitalNotificationSchema = z.object({
    hospitalId: z.string().min(1),
    email: z.string().email(),
    subject: z.string().min(1),
    message: z.string().min(1)
});

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors });
    }
    req.body = result.data;
    next();
};

module.exports = {
    validateDonorNotification: validate(donorNotificationSchema),
    validateHospitalNotification: validate(hospitalNotificationSchema)
};
