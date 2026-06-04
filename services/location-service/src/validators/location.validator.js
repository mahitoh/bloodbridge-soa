const { z } = require('zod');

const nearbySchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    radius: z.number().positive().default(10),
    blood_type: z.string().optional()
});

const distanceSchema = z.object({
    lat1: z.number(),
    lon1: z.number(),
    lat2: z.number(),
    lon2: z.number()
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
    validateNearby: validate(nearbySchema),
    validateDistance: validate(distanceSchema)
};
