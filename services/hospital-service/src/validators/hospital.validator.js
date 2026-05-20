const { z } = require('zod');

const hospitalSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    city: z.string().min(2),
    address: z.string().min(3),
    latitude: z.number().optional(),
    longitude: z.number().optional()
});

const validateHospital = (req, res, next) => {
    const result = hospitalSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: 'Validation failed', details: result.error.flatten().fieldErrors });
    }
    req.body = result.data;
    next();
};

module.exports = { validateHospital };
