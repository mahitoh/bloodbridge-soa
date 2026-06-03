const { z } = require('zod');

const requestSchema = z.object({
    hospitalId: z.string().min(1),
    bloodType: z.string().min(1),
    units: z.number().int().positive(),
    urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
    city: z.string().min(2),
    notes: z.string().optional()
});

const statusSchema = z.object({
    status: z.enum(['OPEN', 'MATCHED', 'FULFILLED', 'CANCELLED'])
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
