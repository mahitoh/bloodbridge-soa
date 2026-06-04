const { z } = require('zod');

const donorSchema = z.object({
    name: z.string().min(2),
    blood_type: z.string().min(1),
    phone: z.string().min(5),
    city: z.string().min(2),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    available: z.boolean().default(true)
});

const availabilitySchema = z.object({
    available: z.boolean()
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
    validateDonor: validate(donorSchema),
    validateAvailability: validate(availabilitySchema)
};
