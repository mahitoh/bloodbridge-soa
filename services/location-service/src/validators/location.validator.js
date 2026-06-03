const { z } = require('zod');

const nearbySchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    radiusKm: z.number().positive().default(10),
    bloodType: z.string().optional()
});

const distanceSchema = z.object({
    from: z.object({ latitude: z.number(), longitude: z.number() }),
    to: z.object({ latitude: z.number(), longitude: z.number() })
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
