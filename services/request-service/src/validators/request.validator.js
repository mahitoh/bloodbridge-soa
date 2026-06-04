const { z } = require('zod');

const requestSchema = z.object({
    hospital_id: z.string().min(1),
    blood_type: z.string().min(1),
    units: z.number().int().positive(),
    urgency: z.enum(['Standard', 'Urgent', 'Critical']).default('Standard'),
    radius: z.number().int().positive().default(20),
    notes: z.string().optional(),
    status: z.enum(['Active', 'Fulfilled', 'Cancelled']).optional()
});

const statusSchema = z.object({
    status: z.enum(['Active', 'Fulfilled', 'Cancelled'])
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
    validateRequest: validate(requestSchema),
    validateStatus: validate(statusSchema)
};
